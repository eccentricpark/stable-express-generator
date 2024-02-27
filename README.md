# 타입스크립트가 적용된 Express 서버

express는 node.js 기반 웹 프레임워크입니다.

자유도가 지나치게 높은 나머지, 프로젝트 구조를 어떻게 잡아야 할 지 알려주지 않습니다.


매번 프로젝트를 만들 때마다 서버 구조를 잡는 것은 상당히 번거롭습니다.

때문에, custom express server를 구축했습니다. 


# loader
기존의 express는 아래와 같이 라우터를 정했을 겁니다.

```
...
router.get('/', (req, res, next)=>{
  ...
})
``

```
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
useExpressServer는 클래스 형태로 라우터를 지정해줍니다.



아래는 클래스형태로 작성된 app.controller.ts의 예시입니다.
```
import { JsonController, Get, Req, Res } from 'routing-controllers';
import { Response, NextFunction, Request } from 'express';

@JsonController('/')
export class AppController {

  constructor() {}

  @Get('/')
  sayHello(@Req() request: Request, @Res() response: Response, next : NextFunction) {
    return response.send(`
      <h1>
        Hello world!
      </h1>
    `);
  }
}
```

Service와 Repository도 클래스 형태이므로, 일관성 있는 구조를 유지할 수 있습니다.