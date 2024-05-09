import {Prop, Schema} from "@nestjs/mongoose";
import {IsString} from "class-validator";
import {User} from "../schemas/user.schema";
import mongoose from "mongoose";

@Schema()
export class TokenDto {
    id: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ required: false })
    @IsString()
    refreshToken?: string;

    constructor(model) {
        this.user = model.user;
        this.refreshToken = model.refreshToken;
        this.id = model._id;
    }
}