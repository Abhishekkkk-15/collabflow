import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { prisma } from '@collabflow/db';
@Injectable()
export class ProjectMemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const pId = req.query.pId;
    console.log('[FROM GUARD]', pId, req.query.wsId, req.query);
    try {
      let isUserProjectMember = await prisma.projectMember.findFirst({
        where: {
          AND: [{ userId: user.id as string }, { id: pId }],
        },
      });
      if (!isUserProjectMember) {
        throw new UnauthorizedException(
          'You are not a member of workspace or project',
        );
      }
      throw new UnauthorizedException('You are not a member of this project');
      return true;
    } catch (error) {
      return false;
    }
  }
}
