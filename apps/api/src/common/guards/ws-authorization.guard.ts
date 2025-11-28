import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { prisma } from '@collabflow/db';
import { WorkspaceMember, WorkspaceRole } from '@prisma/client';
@Injectable()
export class WsAuthorizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const wsId: string = req.query.wsId;
    console.log(user);
    try {
      let userPermision: WorkspaceMember =
        (await prisma.workspaceMember.findFirst({
          where: {
            AND: [{ userId: user.id as string }, { workspaceId: wsId }],
          },
        })) as WorkspaceMember;
      if (!userPermision) {
        throw new UnauthorizedException(
          'You are not allowed to perform this task',
        );
      }

      const AllowedRoles = ['OWNER', 'MAINTAINER'];

      if (
        userPermision.role == AllowedRoles[0] ||
        userPermision.role == AllowedRoles[1]
      ) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}
