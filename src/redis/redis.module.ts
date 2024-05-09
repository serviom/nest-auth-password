import { Module } from '@nestjs/common';
import * as Redis from 'redis';

import { REDIS } from './redis.constants';
import {ConfigService} from "@nestjs/config";

@Module({
    providers: [
        {
            provide: REDIS,
            // useValue: Redis.createClient({ port: 6379, host: 'redis-auth-google-oauth' }),
            useFactory: async (configService: ConfigService) => {
                const port = configService.get<number>('REDIS_PORT');
                const host = configService.get<string>('REDIS_HOST');
                return Redis.createClient({ port, host });
            },
            inject: [ConfigService],
        },
    ],
    exports: [REDIS],
})
export class RedisModule {}