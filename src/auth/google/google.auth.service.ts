import { Injectable } from '@nestjs/common';
import {User} from "../../typeorm/mysql/entities/User";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

type UserDetails = {
  displayName: string,
  email: string
}

@Injectable()
export class GoogleAuthService {
  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(details: UserDetails) {
    console.log('AuthService');
    console.log(details);
    const user = await this.userRepository.findOneBy({ email: details.email });
    console.log(user);
    if (user) return user;
    console.log('User not found. Creating...');
    const newUser = this.userRepository.create(details);
    return this.userRepository.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }


}
