import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { prisma } from '@collabflow/db';
import { Project } from '@collabflow/types';
@Injectable()
export class ProjectMemberGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const pId = req.query.pId;
    const slug = req.query.slug;
    console.log('[FROM GUARD]', pId, req.query.slug);
    console.log(user);
    try {
      let project: Project | null;
      if (slug) {
        project = await prisma.project.findFirst({
          where: {
            slug: slug as string,
          },
        });
      }
      console.log('Project', project!.id);
      let isUserProjectMember = await prisma.projectMember.findFirst({
        where: {
          AND: [{ userId: user.id }, { projectId: project!.id || pId }],
        },
      });
      console.log('object', isUserProjectMember);
      if (!isUserProjectMember) {
        throw new UnauthorizedException(
          'You are not a member of workspace or project',
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
