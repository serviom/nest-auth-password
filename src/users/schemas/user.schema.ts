import {SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {UserDto} from "../dto/user.dto";
import {Expose} from "class-transformer";

export class User extends UserDto {
    @Expose()
    getFullName(): string {
        return `${this.name}`;
    }
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
