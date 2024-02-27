// user.controller.ts
import { JsonController, Get, Req, Res, Post } from 'routing-controllers';
import { Container } from 'typedi';
import { UserService } from '../service/user.service';
import { Response, NextFunction, Request } from 'express';

@JsonController('/user')
export class UserController {
  private userService: UserService;

  constructor() {
    // Use typedi to get an instance of UserService
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

  @Post('/all')
  findAll(@Req() request: Request, @Res() response: Response){
    return this.userService.findAll();
  }
}