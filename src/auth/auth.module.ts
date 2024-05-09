import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from "./auth.controller";
import {User} from '../typeorm/mysql/entities/User';
import {UsersMongoService} from "../users/users.mongo.service";
import {JwtService} from "@nestjs/jwt";
import {GoogleAuthModule} from "./google/google.auth.module";
import {LocalStrategy} from "./strategies/local.strategy";
import {AccessTokenStrategy} from "./strategies/access-token.strategy";
import {RefreshTokenStrategy} from "./strategies/refresh-token.strategy";
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "../users/schemas/user.schema";
import {MailerService} from "../mailer/mailer.service";
import {TokensMongoService} from "../users/tokens.mongo.service";
import {Token, TokenSchema} from "../users/schemas/token.schema";
import {MyMiddleware} from "./middlewares/my.middleware";
import {ForbiddenException2} from "./exceptions/forbidden2.exception";

@Module({
  imports: [
       GoogleAuthModule,
       MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
       MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [
       AuthService,
       UsersMongoService,
       JwtService,
       // {
       //    provide: 'AUTH_SERVICE',
       //    useClass: AuthService,
       // },
      // {
      //     provide: APP_INTERCEPTOR,
      //     useClass: LoggingInterceptor,
      // },
      LocalStrategy,
      //TODO ця стратегія виконується після провірки jwt-auth.guard.ts
      AccessTokenStrategy,
      RefreshTokenStrategy,
      MailerService,
      TokensMongoService,
      ForbiddenException2
  ],
})

export class AuthModule implements  NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MyMiddleware)
            .forRoutes('auth/signUp');
    }
}
