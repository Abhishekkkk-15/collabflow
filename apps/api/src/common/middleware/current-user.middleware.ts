import { Injectable, NestMiddleware } from '@nestjs/common';
import { getToken } from 'next-auth/jwt';
import { config } from 'dotenv';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
config();

interface TExtendedReqest extends Request {
  user: {
    role?: string;
    id?: string;
    image?: string;
    name: string;
  };
}

@Injectable()
export class CurrentMiddleaware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) {
        console.log('Authorization token not provided');
        next();
      }
      const token = req.headers.authorization.split('Bearer ')[1];
      console.log(token);
      const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
      if (!decoded) {
        return next();
      }
      console.log(decoded);
      const user = {
        id: decoded.id as string,
        role: decoded.role as string,
        email: decoded.email as string,
        name: decoded.name as string,
        image: decoded.picture as string,
      };
      req.user = user;
      next();
    } catch (error: any) {
      throw error;
    }
  }
}
