import {BadRequestException, Injectable} from '@nestjs/common';
import * as argon2 from 'argon2';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AuthDto} from './dto/auth.dto';
import {UsersMongoService} from "../users/users.mongo.service";
import {v4} from "uuid";
import {MailerService} from "../mailer/mailer.service";
import {UserDto} from "../users/dto/user.dto";
import {PayloadJwt, TokensMongoService} from "../users/tokens.mongo.service";
import {ReturnValidate} from "./strategies/refresh-token.strategy";


@Injectable()
export class AuthService {
  constructor(
      private usersMongoService: UsersMongoService,
      private jwtService: JwtService,
      private configService: ConfigService,
      private mailerService: MailerService,
      private tokensMongoService: TokensMongoService
  ) {}

  async signUp(user: UserDto): Promise<any> {
    const userExists = await this.usersMongoService.findByEmail(
        user.email
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(user.password);

    const activationHash = v4();
    const newUser = await this.usersMongoService.create({
      ...user,
      password: hash,
      activationHash
    });

    const activationLink = this.configService.get<string>('API_URL') + '/api/auth/activate/' + activationHash;
    this.mailerService.sendActivateLink(newUser, activationLink)

    if (!newUser) {
      return null;
    }

    const tokens = await this.tokensMongoService.generateTokens(newUser._id, newUser.email);
    await this.tokensMongoService.saveToken(newUser._id, tokens.refreshToken);

    const { password, ...result } = newUser.toObject()

    return {
      user: result,
      tokens
    }

  }

  async signIn(data: AuthDto) {
    const user = await this.usersMongoService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');

    const tokens = await this.tokensMongoService.generateTokens(user._id, user.email);
    await this.tokensMongoService.saveToken(user._id, tokens.refreshToken);

    const { password, ...result } = user.toObject();
    return {
      result,
      tokens
    }
  }

  async logout(userId: string) {
//    return this.usersMongoService.update(userId, { refreshToken: null });
  }

  async activateLink(userId: string) {
    // return this.usersMongoService.update(userId, { refreshToken: null });
  }

  async refreshToken(returnValidate: ReturnValidate) {
    console.log('PayloadJwt', returnValidate.payload);
    const tokens = await this.tokensMongoService.generateTokens(returnValidate.user._id, returnValidate.user.email);
    await this.tokensMongoService.removeToken(returnValidate.refreshToken);
    await this.tokensMongoService.saveToken(returnValidate.user._id, tokens.refreshToken);

    const { password, ...result } = returnValidate.user;
    return {
      result,
      tokens
    }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersMongoService.findByEmail(username);
    const passwordMatches = await argon2.verify(user.password, pass);
    if (!passwordMatches) throw new BadRequestException('Password is incorrect');

    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: any) {

    //   console.log(user);
    //   const tokens = await this.getTokens(user._id, user.email);
    //   await this.updateRefreshToken(user._id, tokens.refreshToken);
    //   return tokens;
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
