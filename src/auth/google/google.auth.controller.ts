import {
  Controller,
  Get,
  UseGuards,
  Req
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import {GoogleAuthGuard} from "./google.guard";
import { Request as RequestExpress } from 'express';

@Controller('auth/google')
export class GoogleAuthController {
  // constructor(
  //     // private authService: AuthService,
  //     // private usersService: UsersService
  // ) {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('login')
  handleLogin() {
    return {msg: 'Google Auth'};
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('redirect')
  handleRedirect(@Req() request: RequestExpress) {
    console.log('request.session redirect', request.session)
    return { msg: 'OK' };
  }

  @Public()
  @Get('status')
  user(@Req() request: RequestExpress) {
    console.log('request.user status', request.user);
    console.log('request.session status', request.session);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
