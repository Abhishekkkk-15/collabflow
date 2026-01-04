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
  async use(req: TExtendedReqest, res: Response, next: NextFunction) {
    try {
      // const decoded = await getToken({
      //   req: req!,
      //   secret: process.env.NEXTAUTH_SECRET!,
      // });
      // console.log("user's decpded value", req.headers, 'cookies');
      // if (!decoded) {
      //   return next();
      // }
      const authHeader = req.headers.get('authorization');

      if (!authHeader?.startsWith('Bearer ')) {
        return next();
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
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
