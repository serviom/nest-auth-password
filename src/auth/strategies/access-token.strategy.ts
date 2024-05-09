import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UsersMongoService} from "../../users/users.mongo.service";

type JwtPayload = {
    sub: string;
    username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersMongoService: UsersMongoService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        console.log('Validate AccessTokenStrategy. payload.sub = ', payload.sub);
        return await this.usersMongoService.findById(payload.sub);
    }
}
