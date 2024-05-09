// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { Expose } from 'class-transformer';
// import {User} from "./user.schema";
//
//
// const {Schema, model} = require('mongoose');
//
// const TokenSchema = new Schema({
//     user: {type: Schema.Types.ObjectId, ref: 'User'},
//     refreshToken: {type: String, required: true},
// })
// module.exports = model('Token', TokenSchema);
//


import {SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {TokenDto} from "../dto/token.dto";

export class Token extends TokenDto {}
export type TokenDocument = Token & Document;
export const TokenSchema = SchemaFactory.createForClass(Token);
