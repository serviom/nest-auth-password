import {HttpException, HttpStatus} from "@nestjs/common";

export class ForbiddenException2 extends HttpException {
    constructor() {
        super('Forbidden2', HttpStatus.FORBIDDEN);
    }
}