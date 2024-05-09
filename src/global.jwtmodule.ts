import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES') },
            }),
            inject: [ConfigService],
        }),
        ConfigModule, // Assuming you have a ConfigModule
    ],
    exports: [JwtModule],
})
export class GlobalJwtModule {}
