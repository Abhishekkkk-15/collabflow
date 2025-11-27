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

@Injectable()
export class ProjectService {
  async create(dto: CreateProjectDto, ownerId: string) {
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
            ownerId,
            dueDate: dto.dueDate,
          },
        });
        const membersToCreate = [
          {
            projectId: project.id,
            userId: ownerId,
            role: 'OWNER' as ProjectRole,
            joinedAt: new Date(),
          },
          ...(dto.members?.map((m) => ({
            projectId: project.id,
            userId: m.userId,
            role: m.role as ProjectRole,
            joinedAt: new Date(),
          })) || []),
        ];
        await tx.projectMember.createMany({
          data: membersToCreate,
        });
        return await tx.project.findUnique({
          where: {
            id: project.id,
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
            members: {
              select: {
                id: true,
                userId: true,
                role: true,
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
            workspace: {
              select: {
                id: true,
                name: true,
                description: true,
                owner: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                    id: true,
                  },
                },
              },
            },
          },
        });
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
}
