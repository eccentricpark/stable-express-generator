import { Service } from "typedi";
import { UserRepository } from "./user.repository";

@Service()
export class UserService{
  constructor(private userRepository : UserRepository){}

  sayHello(name : string) : string{
    return `User Service Hello ${name}`;
  }

  findAll(){
    return this.userRepository.findAll();
  }
}