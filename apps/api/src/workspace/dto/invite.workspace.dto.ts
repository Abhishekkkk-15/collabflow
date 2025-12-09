import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { type WorkspaceRole } from '@prisma/client';
import { Type } from 'class-transformer';
export class InviteWorkspaceDto {
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
  @IsEmail()
  email!: string;
}
