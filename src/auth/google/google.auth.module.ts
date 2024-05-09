import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google.auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthController } from "./google.auth.controller";
import {GoogleStrategy} from "./google.strategy";
import { User } from '../../typeorm/mysql/entities/User';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserService} from "../../users/users.service";
import {SessionSerializer} from "../utils/Serializer";

export const GOOGLE_AUTH_SERVICE = 'GOOGLE_AUTH_SERVICE'

@Module({
  imports: [
       TypeOrmModule.forFeature([User]),
       PassportModule.register({
           session: true,
       }),
  ],
  controllers: [GoogleAuthController],
  providers: [
       SessionSerializer,
       GoogleStrategy,
       {
          provide: GOOGLE_AUTH_SERVICE,
          useClass: GoogleAuthService,
       },
       UserService
      // {
      //     provide: USER_SERVICE,
      //     useClass: GoogleAuthService,
      // },
      // UsersService,
      // {
      //     provide: 'UserModel',
      //     useValue: User, // Або інший спосіб введення UserModel залежно від вашого випадку
      // },
      // UsersModule
      // {
      //     provide: APP_INTERCEPTOR,
      //     useClass: LoggingInterceptor,
      // },
  ],
})

export class GoogleAuthModule {}
