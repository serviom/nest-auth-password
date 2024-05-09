
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";

export class AuthDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }
}

export class AuthDtoEnter extends PartialType(AuthDto) {}
