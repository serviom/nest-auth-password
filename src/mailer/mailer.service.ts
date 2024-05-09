import {Injectable} from '@nestjs/common';
import {MailerService as MailerServiceNest} from '@nestjs-modules/mailer';
import {ConfigService} from "@nestjs/config";
import {User} from "../users/schemas/user.schema";
import {DataEmailDto} from "./dto/dataEmail.dto";

@Injectable()
export class MailerService {
    constructor(
        private readonly mailerService: MailerServiceNest,
        private readonly configService: ConfigService) {
    }

    public sendActivateLink(user: User, activationLink: string): void {
        this.sendMail({
            to: user.email,
            subject: 'Активація акаунта на ' + this.configService.get<string>('API_URL'),
            text: 'welcome',
            html:
                `
                    <div>
                        <h1></h1>
                        <a href="${activationLink}">${activationLink}</a>
                    </div>
                `,
        })
    }

    public testMailer(): void {
        this.sendMail({
            to: 'test@nestjs.com',
            subject: 'Testing Nest MailerModule ✔',
            text: 'welcome test from' + this.configService.get<string>('APP_NAME'),
            html: `<b>welcome test from ${this.configService.get<string>('APP_NAME')}</b>`,
        })
    }

    public sendMail(dataEmailDto: DataEmailDto): void {
        const data = !dataEmailDto.from ? {...dataEmailDto, ...{from: this.configService.get<string>('MAILER_FROM')}} : dataEmailDto;
        this.mailerService
            .sendMail(data)
            .then(() => {
                console.log('send example email')
            })
            .catch(() => {
            });
    }
}