import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('MYSQL_HOST'),
                port: configService.get<number>('MYSQL_PORT'),
                username: configService.get<string>('MYSQL_USERNAME'),
                password: configService.get<string>('MYSQL_PASSWORD'),
                database: configService.get<string>('MYSQL_DATABASE'),
                entities: [User],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MysqlModule {}