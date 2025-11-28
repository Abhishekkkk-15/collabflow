// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const tokenCookie =
      req.cookies['authjs.session-token'] ||
      req.cookies['__Secure-authjs.session-token'];
    if (!tokenCookie) return false;
    return true;
  }
}
