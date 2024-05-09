import { Module } from '@nestjs/common';
import { UsersMongoService } from './users.mongo.service';
import {UsersController} from "./users.controller";
import { PassportModule } from '@nestjs/passport';
import {User} from "../typeorm/mysql/entities/User";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersMongoService,
  ],
  exports: [UsersMongoService],
})
export class UsersModule {}
