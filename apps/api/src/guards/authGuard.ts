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
      // getToken handles encrypted JWT automatically
      const decoded = await getToken({
        req, // pass the request so getToken can read cookies
        secret: process.env.NEXTAUTH_SECRET!,
      });

      if (!decoded) return false;
      console.log(decoded);
      // attach user info to request
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
