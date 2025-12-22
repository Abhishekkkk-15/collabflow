import { WorkspaceRole } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInviteDto {
  @IsNotEmpty()
  @IsString()
  notificationId!: string;
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;
}
export type InviteMeta = {
  role?: WorkspaceRole;
  workspaceId?: string;
};
