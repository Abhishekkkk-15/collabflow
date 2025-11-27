import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { prisma } from '@collabflow/db';
@Injectable()
export class MemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const workspaceId = req.query.wsId;
    console.log('comming here', user, workspaceId);
    try {
      console.log('try');

      let isUserMember = await prisma.workspaceMember.findFirst({
        where: {
          AND: [{ userId: user.id as string }, { workspaceId }],
        },
      });
      console.log('after try');

      if (!isUserMember)
        throw new UnauthorizedException('You are not a member of this project');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
