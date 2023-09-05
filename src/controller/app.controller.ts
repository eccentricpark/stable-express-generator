// user.controller.ts
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