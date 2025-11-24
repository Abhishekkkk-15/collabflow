import { Injectable } from '@nestjs/common';
import { prisma } from '@collabflow/db';
import { Account, User, UserRole } from '@collabflow/types';
// import { prisma } from '../../../packages/db';
// import type { Account, User, UserRole } from '../../../packages/types';
@Injectable()
export class AppService {
  async getHello(currentUser: string): Promise<User[]> {
    let u: UserRole = 'ADMIN';
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser,
        },
      },
    });
    console.log(users);
    return users.map((u) => ({
      ...u,
      role: u.role as UserRole, // <-- cast string → UserRole
    }));
  }
}
