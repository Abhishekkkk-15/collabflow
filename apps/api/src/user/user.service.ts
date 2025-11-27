import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from '@collabflow/db';
import { Account, User, UserRole } from '@collabflow/types';
@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  async findAll(currentUser: string): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser,
        },
      },
    });
    return users.map((u) => ({
      ...u,
      role: u.role as UserRole,
    }));
  }

  async currentUserRoles(id: string) {
    try {
      const workspaceRoles = await prisma.workspaceMember.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          role: true,
          workspaceId: true,
        },
      });
      const projectRoles = await prisma.projectMember.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          meta: true,
          role: true,
          projectId: true,
        },
      });
      return { workspaceRoles, projectRoles };
    } catch (error) {
      console.log(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
