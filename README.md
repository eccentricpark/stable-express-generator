# 타입스크립트가 적용된 Express 서버

express는 node.js 기반 웹 프레임워크입니다.<br>
자유도가 지나치게 높은 나머지, 프로젝트 구조를 어떻게 잡아야 할 지 알려주지 않습니다.
<br><br>
매번 프로젝트를 만들 때마다 서버 구조를 잡는 것은 상당히 번거롭습니다.<br>
때문에, custom express server를 구축했습니다. 

# loader
useExpressServer는 클래스 형태로 라우터를 지정해줍니다.

```
import express from "express";
import morgan from "morgan";
import cors from 'cors';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from "typedi";
import { GlobalErrorHandler } from "../middlewares/global-error-handler";
import { GlobalResponseInterceptor } from "../middlewares/global-response-interceptor";
import { UserController } from "../features/user/user.controller";
import { AppController } from "../app.controller";

export async function setExpress(app: express.Application) {
  useContainer(Container);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(morgan('dev'));
  useExpressServer(app, {
    controllers: [UserController, AppController],
    interceptors: [GlobalResponseInterceptor],
    middlewares: [GlobalErrorHandler]
  });
}
```
loader 내 express.ts 파일에서 서버 옵션을 추가해주면 됩니다.<br>
예를 들어, cors를 적용한다면, 아래처럼 적으면 되겠죠?

```
...

import cors from 'cors';

export async function setExpress(app: express.Application) {

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors()); // cors 추가
  useExpressServer(app, {
    controllers: [path.join(`${__dirname}/../controller/*`)],
  });
}

```


# Controller

기존의 express는 아래와 같이 라우터를 정했을 겁니다.

```
...
router.get('/', (req, res, next)=>{
  ...
})
```


아래는 클래스형태로 작성된 user.controller.ts의 예시입니다.

```
// user.controller.ts
// user.controller.ts
import { JsonController, Get, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from './user.service';

@Service()
@JsonController('/user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('/')
  sayHello() {
    return this.userService.sayHello("Deno");
  }

  @Post('/profile')
  findAll(){
    return this.userService.findAll();
  }
}

```

## 컨트롤러가 굳이 클래스형태여야 함?

Service와 Repository도 클래스 형태이므로, 일관성 있는 구조를 유지할 수 있습니다.

### 문제점
Container.get()을 사용해야 했던 문제를 해결했습니다.<br><br>

routing-controllers에 있는 UseContainer에<br>
typeDI의 Container를 연결하면 해결됩니다.<br><br>
이 때, 모든 컨트롤러에는 @Service()를 추가해야 합니다.<br>
공통 응답 핸들러에도 @Service()를 추가해야 합니다. (컨트롤러에서 동작하니까)
<br><br><br>

# response

응답은 모두 middlewares에서 처리했습니다.<br>
만약 마음에 안든다면 재정의하십시오.<br>

```
// src/interceptors/GlobalResponseInterceptor.ts
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
import { Service } from 'typedi';

/**
 * Controller에서 return한 값을 { data: ..., message: 'OK' } 형태로 감싸주는 인터셉터
 * 에러 상황은 별도의 글로벌 에러 미들웨어에서 처리됨
 */
@Service()
@Interceptor()
export class GlobalResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    // 이미 (data, message) 구조라면 그대로 반환하거나,
    // 반환 구조 커스터마이징 하고 싶으면 여기서 처리
    // if (content && (content.data || content.message)) {
    //   return content;
    // }

    return content;
  }
}
```

# error handler
마찬가지로 공통 핸들러로 처리했습니다.<br>
이 또한 마음에 안들면 재정의하고<br>
각 기능별, 에러 처리가 별도로 필요하면<br>
컨트롤러에서 따로 정의하십시오.<br>

```
// src/middlewares/GlobalErrorHandler.ts
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';

/**
 * Controller 혹은 Service에서 throw된 예외를 일괄적으로 처리해주는 전역 에러 미들웨어
 */
@Service()
@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response) {
    // 로깅 처리 (winston 등)
    console.error('[GlobalErrorHandler]', error);

    // routing-controllers의 HttpError를 상속하거나
    // 커스텀 에러 클래스에 따라 다른 상태 코드를 매핑할 수 있음
    const statusCode = error.httpCode || 404;
    return response.status(statusCode).json({
      message: error.message || 'Bad Request',
      data: null,
    });
  }
}
```


# service

```
// user.service.ts
import { Service } from "typedi";
import { UserRepository } from "../repository/user.repository";

@Service()
export class UserService{
  constructor(private userRepository : UserRepository){}

  sayHello(name : string) : string{
    return `User Service Hello ${name}`;
  }

  async findAll(){
    return await this.userRepository.findAll();
  }
}
```
서비스는 nest와 별 반 차이 없습니다.<br><br>
다만 @Injectable()을 쓰지 않는다는 것과 차이가 있는데요.<br>
@Service()가 비슷한 역할을 하고 있기 때문에 큰 차이 없이 사용하면 됩니다.


# repository

```
import { Service } from 'typedi';
import { useConnection, useTransaction } from '../../config/database-handler';

/**
 * Repository는 필요하면 커스텀하고 필요없으면 삭제
 */
@Service()
export class UserRepository {
	findAll() {
		return {
			name : "Test Developer",
			age : "25",
			message : "Hello!"
		};
	}

	// 데이터베이스 쿼리는 아래처럼 작성하세요.
	// insert, update, delete는 useTransaction으로 바꾸고 적절한 SQL을 적용
	async findOneByAniName(name: string) {
    return useConnection(async (connection) => {
      const [rows] = await connection.query(`SELECT name, age, message FROM T_USER WHERE name = ?`, [`%${name}%`]);
      return rows;
    });
  }
}

```

repository는 데이터베이스 관련 처리를 담당합니다.<br>
MySQL을 기준이며, SQL을 그대로 넣고 있습니다.<br><br>


그래서 Sequelize와 같은 ORM을 사용할 수 있는 방법을 생각하고 있습니다.<br>
(시간이 좀 필요합니다.)