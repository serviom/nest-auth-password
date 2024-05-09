import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {User} from "./schemas/user.schema";


export interface PayloadInit {
    userId: string,
    email: string
}

export interface PayloadJwt extends PayloadInit {
    id: string,
    exp: string
}

// {
//     "sub": "662241bce63b09a92a6bc3d8",
//     "username": "iomm@ukr.net",
//     "iat": 1713522076,
//     "exp": 1714126876
// }

@Injectable()
export class TokensMongoService {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    // generateTokens(payload) {
    //     const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'})
    //     const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
    //     return {
    //         accessToken,
    //         refreshToken
    //     }
    // }

    makePayloadObject(userId: string, email: string): PayloadInit {
        return {
            userId: userId,
            email
        };
    }

    async generateTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                this.makePayloadObject(userId, email),
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
                },
            ),
            this.jwtService.signAsync(
                this.makePayloadObject(userId, email),
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId, refreshToken): Promise<TokenDocument> {
        const tokenData = await this.tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken): Promise<any> {
        const result = await this.tokenModel.deleteOne({refreshToken})
        return result;
    }

    async findToken(user: User, refreshToken: string): Promise<TokenDocument> {
        return this.tokenModel.findOne({user: user.id, refreshToken})
    }
}
