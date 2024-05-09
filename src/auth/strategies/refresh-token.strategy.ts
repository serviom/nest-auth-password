import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {BadRequestException, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {PayloadJwt, TokensMongoService} from "../../users/tokens.mongo.service";
import {UsersMongoService} from "../../users/users.mongo.service";
import {UserDocument} from "../../users/schemas/user.schema";


export interface ReturnValidate {
    user: UserDocument,
    payload: PayloadJwt,
    refreshToken: string
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {

    private refreshToken: string | null = null;

    constructor(
        private configService: ConfigService,
        private tokenMongoService: TokensMongoService,
        private usersMongoService: UsersMongoService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // ExtractJwt.fromAuthHeaderAsBearerToken(),
                // ExtractJwt.fromUrlQueryParameter(process.env.REFRESH_TOKEN_VALUE),
                req => {
                    if (req && req.cookies) {
                        this.refreshToken = req.cookies[process.env.REFRESH_TOKEN_VALUE];
                    }
                    return this.refreshToken;
                },
            ]),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: PayloadJwt): Promise<ReturnValidate>  {
        const user = await this.usersMongoService.findByEmail(payload.email);
        if (!user) throw new BadRequestException('User does not exist');

        const tokenFromDb = await this.tokenMongoService.findToken(user, this.refreshToken);

        if (!tokenFromDb) {
            throw new BadRequestException('Token is not exists');
        }

        return {
            user,
            payload,
            refreshToken: this.refreshToken
        }
    }

}
