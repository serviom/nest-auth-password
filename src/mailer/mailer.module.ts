import { Module } from '@nestjs/common';
import { MailerModule as MailerModuleNest } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import {MailerService} from "./mailer.service";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        MailerModuleNest.forRoot({
            transport: {
                host: 'sandbox.smtp.mailtrap.io',
                port: 587,
                secure: false,
                auth: {
                    user: '3ed777fba754f0',
                    pass: '0c554b077b4354',
                },
            },
            // transport: 'smtps://3ed777fba754f0:0c554b077b4354@sandbox.smtp.mailtrap.io',
            defaults: {
                from: '"nest-modules" <modules@nestjs.com>',
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [
        ConfigService,
        MailerService
    ],
    exports: [
        MailerService
    ]
})
export class MailerModule {}