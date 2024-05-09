import {Inject, Logger, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleAuthModule } from './auth/google/google.auth.module';
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {APP_GUARD} from "@nestjs/core";
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {AccessTokenStrategy} from "./auth/strategies/access-token.strategy";
import {LocalStrategy} from "./auth/strategies/local.strategy";
import {RefreshTokenStrategy} from "./auth/strategies/refresh-token.strategy";
import {GlobalJwtModule} from "./global.jwtmodule";
import {AuthService} from "./auth/auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import { User } from './typeorm/mysql/entities/User';
import * as session from "express-session";
import * as passport from "passport";
import { PassportModule } from '@nestjs/passport';
import {REDIS} from "./redis/redis.constants";
import {RedisModule} from "./redis/redis.module";
import {RedisClient} from "redis";
import * as Redis from "redis";
import {MysqlModule} from "./typeorm/mysql/mysql.module";
import {MongoModule} from "./mongo/mongo.module";
import {AuthModule} from "./auth/auth.module";
import {SessionSerializer} from "./auth/utils/Serializer";
import {MailerModule} from "./mailer/mailer.module";
// import RedisStore from "connect-redis";

let RedisStore = require('connect-redis')(session)

@Module({
  imports: [
      RedisModule,
      MysqlModule,
      // MongoModule,
      AuthModule,
      MailerModule,
      // UsersModule,
      GlobalJwtModule,
      ConfigModule.forRoot({
          isGlobal: true,
      }),
      MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [
      //TODO we have the right to do so
      {
          provide: 'APP_SERVICE',
          useClass: AppService,
      },
      // UsersService,
      // Logger,
      // AuthService,
      // AccessTokenStrategy,
      // LocalStrategy,
      // RefreshTokenStrategy,
      // {
      //   provide: APP_GUARD,
      //   useClass: JwtAuthGuard,
      // },
      // SessionSerializer,
      // {
      //     provide: 'AUTH_SERVICE',
      //     useClass: AuthService1,
      // },
      // {
      //     provide: APP_INTERCEPTOR,
      //     useClass: LoggingInterceptor,
      // },
  ],
})

export class AppModule implements NestModule {
    constructor(@Inject(REDIS) private readonly redis: RedisClient) {}

    configure(consumer: MiddlewareConsumer) {

        const sessionOptions: session.SessionOptions = {
            store: new RedisStore({ client: this.redis}),
            saveUninitialized: true,
            secret: 'asiodasjoddjdoasddasoidjasiodasdjaiodd',
            resave: false,
            cookie: {
                sameSite: false,
                httpOnly: false,
                maxAge: 600000,
            },
        };

        consumer
            .apply(
                session(sessionOptions),
                passport.initialize(),
                passport.session(),
            )
            .forRoutes('*');
    }
}
