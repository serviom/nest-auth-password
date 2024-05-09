import {
  Body,
  Controller,
  Get, Param,
  Post,
  Request, UseGuards, Req, UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersMongoService } from '../users/users.mongo.service';
import { Public } from './decorators/public.decorator';
import {LocalAuthGuard} from "./local-auth.guard";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthDto, AuthDtoEnter} from "./dto/auth.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {AuthGuard} from "@nestjs/passport";
import {JwtRefreshAuthGuard} from "./jwt-refresh-auth.guard";
import {MailerService} from "../mailer/mailer.service";
import {UserDto} from "../users/dto/user.dto";
import {MyMiddleware} from "./middlewares/my.middleware";
import {ForbiddenException2} from "./exceptions/forbidden2.exception";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // private mailService: MailerService
      // private usersService: UsersService
  ) {}


  // @Public()
  @Get('status')
  @UseGuards(JwtAuthGuard)
  user(@Request() req) {

    console.log(req);
    // console.log('request.user status', request.user);
    // console.log('request.session status', request.session);
    if (req.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('auth login');
    // return this.authService.login(req.user);
  }

  @Public()
  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(new UserDto(createUserDto))
  }

  // @UseInterceptors(SigninInterceptor)
  @Public()
  @Post('signIn')
  signIn(@Body() data: AuthDtoEnter) {
    console.log('data', data);
      return this.authService.signIn(new AuthDto(data));
  }

  @Public()
  @Get('forbidden2')
  forbidden() {
    throw new ForbiddenException2();
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req) {
     return await this.authService.logout(req.user['_id']);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh-token')
  async refreshToken(@Request() req) {
      return await this.authService.refreshToken(req.user);
  }

  @Public()
  @Get('email/test')
  async emailTest() {
    // await this.mailService.example();
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Get('activate/:link')
  async activateLink(@Request() req) {
    return await this.authService.activateLink(req.user['_id']);
  }

  // @Public()
  @UseGuards(JwtAuthGuard)
  @Get('app-profile')
  getProfile(@Request() req) {
    if (req.user) {
      return req.user;
    }

    return 'is Public'
  }



  //TODO треба зробити endpoint для refresh token

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findById(@Param('id') id: string, @Req() req: Request & User) {
  //   return this.usersService.findById(id);
  // }


}
