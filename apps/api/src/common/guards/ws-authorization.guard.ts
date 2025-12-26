import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { prisma } from '@collabflow/db';
import { WorkspaceMember, WorkspaceRole } from '@prisma/client';
@Injectable()
export class WsAuthorizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const wsSlug: string = req.query.wsSlug;
    try {
      let ws = await prisma.workspace.findFirst({
        where: {
          slug: wsSlug,
        },
      });
      if (!ws) throw new ForbiddenException('Auauthorized');
      let userPermision: WorkspaceMember =
        (await prisma.workspaceMember.findFirst({
          where: {
            AND: [{ userId: user.id as string }, { workspaceId: ws?.id }],
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
