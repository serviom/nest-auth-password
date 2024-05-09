import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete, UseGuards, Request,
} from '@nestjs/common';
import { UsersMongoService } from './users.mongo.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {Public} from "../auth/decorators/public.decorator";

@Controller('users')
export class UsersController {
    constructor(private readonly UsersMongoService: UsersMongoService) {}

    @Get()
    @Public()
    findAll() {
        return this.UsersMongoService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.UsersMongoService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.UsersMongoService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.UsersMongoService.remove(id);
    }
}
