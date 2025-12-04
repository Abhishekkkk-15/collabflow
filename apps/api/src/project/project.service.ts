import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { prisma } from '@collabflow/db';
import { Project, ProjectMember, ProjectRole } from '@collabflow/types';
import { createSlug } from '../common/utils/slug-helper';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import type { User } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(@InjectQueue('projectQueue') private projectQueue: Queue) {}
  async create(dto: CreateProjectDto, user: User) {
    try {
      return prisma.$transaction(async (tx) => {
        const worspaceExist = await tx.workspace.findUnique({
          where: {
            id: dto.workspaceId,
          },
        });

        if (!worspaceExist) {
          throw new NotFoundException('Workspace not found');
        }
        if (!worspaceExist?.isActive) {
          throw new BadRequestException('Workspace is archived');
        }
        const slug = createSlug(dto.slug || dto.name);
        const project = await tx.project.create({
          data: {
            name: dto.name,
            slug,
            description: dto.description || '',
            workspaceId: dto.workspaceId,
            ownerId: user.id,
            dueDate: dto.dueDate,
          },
        });

        await tx.projectMember.create({
          data: {
            projectId: project.id,
            role: 'OWNER',
            userId: user.id,
          },
        });

        this.projectQueue.add('project:create', {
          project,
          members: dto.members,
          invitedBy: user,
        });

        return project;
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(workspaceId: string, currentUserId: string) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          workspaceId,
          OR: [
            { ownerId: currentUserId },
            { members: { some: { userId: currentUserId } } },
          ],
        },
        include: {
          owner: true,
          members: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      if (!projects) {
        throw new NotFoundException('Pojects not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, slug: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug }],
      },
      include: {
        owner: {
          select: {
            name: true,
            image: true,
            id: true,
            email: true,
          },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
  async getProjectMembers(slug: string, limit: number) {
    const project = await prisma.project.findFirst({
      where: { slug: slug as string },
      select: { id: true },
    });
    if (!project) throw new BadRequestException("Project doesn't exit's");
    const count = await prisma.projectMember.count({
      where: {
        projectId: project?.id,
      },
    });
    const members = await prisma.projectMember.findMany({
      where: {
        projectId: project?.id,
      },
      include: {
        user: {
          select: { name: true, image: true, id: true, email: true },
        },
      },
      take: limit,
    });
    console.log(project, members);
    if (!members) throw new NotFoundException('Members not found');
    return { members, count };
  }
}
