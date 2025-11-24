// auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getToken } from 'next-auth/jwt';
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

    try {
      const decoded = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!,
      });

      if (!decoded) return false;
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        name: decoded.name,
      };

      return true;
    } catch (err) {
      console.error('JWT verification failed', err);
      return false;
    }
  }
}
