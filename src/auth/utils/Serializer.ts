import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../typeorm/mysql/entities/User';
import { GoogleAuthService } from '../google/google.auth.service';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        // @Inject('GOOGLE_AUTH_SERVICE') private readonly googleAuthService: GoogleAuthService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {
        super();
    }

    serializeUser(user: User, done: Function) {
        console.log('Serializer User');
        console.log(user)
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.userRepository.findOneBy(payload.id);
        console.log('Deserialize User');
        console.log(user);
        return user ? done(null, user) : done(null, null);
    }
}