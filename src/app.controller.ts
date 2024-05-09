import {AppService} from "./app.service";
import {Controller, Request, Post, UseGuards, Get, Res, Inject} from '@nestjs/common';
import {LocalAuthGuard} from "./auth/local-auth.guard";
import { AuthService } from './auth/auth.service';
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {Public} from "./auth/decorators/public.decorator";
import {MailerService} from "./mailer/mailer.service";

@Controller()
export class AppController {
    constructor(
         private readonly mailService: MailerService,
         @Inject('APP_SERVICE') private readonly appService: AppService,
    ) {}

     @Get()
     @Public()
     // @Res({ passthrough: true })
     getHello() {
         return this.appService.getHello();
     }

    @Public()
    @Get('email/test')
    async emailTest() {
        console.log('email/test');
        await this.mailService.testMailer();
    }

    // @UseGuards(LocalAuthGuard)
    // @Post('auth/login')
    // async login(@Request() req) {
    //     return this.authService.login(req.user);
    // }

}




