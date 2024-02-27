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