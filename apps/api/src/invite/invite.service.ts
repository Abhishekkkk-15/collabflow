import { Injectable, NotFoundException } from '@nestjs/common';
import { AcceptInviteDto, InviteMeta } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { User } from 'next-auth';
import { prisma } from '@collabflow/db';
import { WorkspaceRole } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { SendInviteDto } from './dto/send-invite.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { WorkspaceService } from '../workspace/workspace.service';
@Injectable()
export class InviteService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectQueue('workspaceQueue') private workspaceQueue: Queue,
    private readonly workspaceService: WorkspaceService,
  ) {}
  async acceptInvite(dto: AcceptInviteDto, user: User) {
    let notification = await this.notificationService.findOne(
      dto.notificationId,
    );
    if (!notification) throw new NotFoundException('Notification not found');

    const meta =
      notification.meta && typeof notification.meta === 'object'
        ? (notification.meta as InviteMeta)
        : null;
    const role = meta?.role ?? 'CONTRIBUTOR';
    const new_member = await prisma.workspaceMember.create({
      data: {
        role,
        userId: user.id as string,
        workspaceId: dto.workspaceId,
      },
    });
    await this.reject(dto.notificationId);
    return { sucess: true };
  }

  async wsInvite(id: string, dto: SendInviteDto, owner: User) {
    try {
      const workspace = await prisma.workspace.findUnique({
        where: {
          id,
        },
      });

      if (!workspace) throw new NotFoundException('Workspace not found');

      await this.workspaceQueue.add('workspace:create', {
        workspace: workspace,
        members: dto.members,
        invitedBy: owner,
      });
      return { message: 'Success' };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all invite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invite`;
  }

  update(id: number, updateInviteDto: UpdateInviteDto) {
    return `This action updates a #${id} invite`;
  }

  async reject(id: string) {
    await prisma.notification.delete({ where: { id: id } });
  }
}
