import { Injectable } from '@nestjs/common';
import {User} from "../typeorm/mysql/entities/User";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";


@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

}
