import { Service } from "typedi";


@Service()
export class UserService{
  constructor(){}

  sayHello(name : string) : string{
    return `User Service Hello ${name}`;
  }
}