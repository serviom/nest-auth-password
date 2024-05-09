import {IsEmail, IsNotEmpty, IsString, Length, MinLength, ValidationArguments} from "class-validator";
import {Schema, Prop} from "@nestjs/mongoose";
import {Expose} from "class-transformer";

const MIN_LENGTH_NAME = 3;

@Schema()

export class UserDto {
    id: string;

    @Prop({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_LENGTH_NAME, {
        message: 'Name must be at least ' + MIN_LENGTH_NAME + ' characters',
    })
    name: string;

    @Prop({ required: false })
    @IsString()
    @MinLength(MIN_LENGTH_NAME, {
        message: 'secondName must be at least ' + MIN_LENGTH_NAME + ' characters',
    })
    secondName2?: string;

    @Prop({ required: true, unique: true })
    @IsEmail()
    email: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @Length(5, 50, {
        message: (validationArguments: ValidationArguments) => {
            return 'Param ' + validationArguments.property + ' must be between ' + validationArguments.constraints[0] + ' and '
                + validationArguments.constraints[1] + ' but current value = ' + validationArguments.value;
        }}
    )
    password: string;

    @Prop({ required: true, default: false})
    isActivated?: boolean;

    @Prop({ required: true})
    activationHash?: string;

    constructor(model) {
        this.email = model.email;
        this.name = model.name;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.activationHash = model.activationHash;
        this.password = model.password;
        this.secondName2 = model.secondName2;
    }
}

export class UserRendering extends UserDto {
    @Expose()
    getFullName(): string {
        return `${this.name}`;
    }
}
