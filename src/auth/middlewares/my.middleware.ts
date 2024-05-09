import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class MyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        console.log('MyMiddleware is invoked!');
        next();
    }
}