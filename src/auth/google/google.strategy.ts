import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleAuthService } from './google.auth.service';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('GOOGLE_AUTH_SERVICE') private readonly googleAuthService: GoogleAuthService
    ) {
        const clientID = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const callbackURL = process.env.GOOGLE_CALLBACK_URL;

        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['profile', 'email']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const user = await this.googleAuthService.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName,
        });
        return user || null;
    }
}