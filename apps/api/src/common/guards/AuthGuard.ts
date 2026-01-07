// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;
    return true;
  }
}
