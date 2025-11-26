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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
