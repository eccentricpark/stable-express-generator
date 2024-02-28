# 타입스크립트가 적용된 Express 서버

express는 node.js 기반 웹 프레임워크입니다.<br>
자유도가 지나치게 높은 나머지, 프로젝트 구조를 어떻게 잡아야 할 지 알려주지 않습니다.
<br><br>
매번 프로젝트를 만들 때마다 서버 구조를 잡는 것은 상당히 번거롭습니다.<br>
때문에, custom express server를 구축했습니다. 

# loader
useExpressServer는 클래스 형태로 라우터를 지정해줍니다.

```
// loader/express.ts
import express from "express";
import { useExpressServer } from 'routing-controllers';
import path from 'path';

export async function setExpress(app: express.Application) {

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  useExpressServer(app, {
    controllers: [path.join(`${__dirname}/../controller/*`)],
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
...

@JsonController('/user')
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = Container.get(UserService); 
  }

  @Get('/')
  sayHello(@Req() request: Request, @Res() response: Response, next : NextFunction) {
    try {
      const say = this.userService.sayHello("Park");
      return response.status(200).json({
        data: say,
        message: "This is user router"
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  ...
}
```

## 컨트롤러가 굳이 클래스형태여야 함?

Service와 Repository도 클래스 형태이므로, 일관성 있는 구조를 유지할 수 있습니다.

### 문제점
Controller에서 Container를 쓰는데 아래와 같은 코드로 작성하면 오동작합니다.

```
// user.controller.ts
@JsonController('/user')
export class UserController {

  // 오류 발생!
  constructor(private userService: UserService) {}
  ...
}

```

일관성 있는 구조를 유지해야 하므로, 최대한 빨리 해결방법을 찾아보겠습니다.<br>
만약 방법이 없다면 Controller는 Container에서 Service를 받아오는 방식을 그대로 두겠습니다.


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
import { Database } from '../config/Database';

@Service()
export class UserRepository {
	async findAll() {
		const connection = await Database.getInstance().getConnection();
		try {
			const [rows] = await connection.query('SELECT * FROM stable_user', []);
			return rows;
		} finally {
			// 연결을 반환하여 pool에 다시 넣습니다.
			connection.release();
		}
	}
}

```
repository는 데이터베이스 관련 처리를 담당합니다.<br>
MySQL을 기준이며, SQL을 그대로 넣고 있습니다.<br><br>

그래서 Sequelize와 같은 ORM을 사용할 수 있는 방법을 생각하고 있습니다.<br>
(시간이 좀 필요합니다.)