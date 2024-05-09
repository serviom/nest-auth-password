import { Module } from '@nestjs/common';
import { UsersMongoService } from './users.mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {UsersController} from "./users.controller";
import {AuthService} from "../auth/auth.service";
import {MongoModule} from "../mongo/mongo.module";

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
      UsersMongoService,
      {
        provide: 'AUTH_SERVICE',
        useClass: AuthService,
      },
  ],
  exports: [UsersMongoService],
})

export class UsersMongoModule {}
