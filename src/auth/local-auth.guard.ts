import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext) {
        console.log('can active');
        return super.canActivate(context);
    }
}
