import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO } from './mongo.constants';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI),
    ],
})
export class MongoModule {}