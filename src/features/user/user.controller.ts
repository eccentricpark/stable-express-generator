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