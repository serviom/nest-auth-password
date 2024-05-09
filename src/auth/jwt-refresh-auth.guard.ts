import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
    canActivate(context: ExecutionContext) {
        console.log('Can active JwtRefreshAuthGuard');
        return super.canActivate(context);
    }
}
