import { WorkspaceRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class SendInviteDto {
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members?: MemberDto[];
}

export class MemberDto {
  @IsString()
  userId!: string;

  @IsString()
  role!: WorkspaceRole;
  @IsString()
  email!: WorkspaceRole;
}
