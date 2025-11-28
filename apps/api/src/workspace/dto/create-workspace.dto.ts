import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import type { Workspace } from '@collabflow/types';
import type { WorkspaceRole } from '@prisma/client';
import { Type } from 'class-transformer';
export class CreateWorkspaceDto {
  @IsNotEmpty({ message: "Name can't be empty" })
  @IsString({ message: 'Name must be string' })
  name!: string;
  @IsString({ message: 'Slug must be string' })
  slug?: string;
  @IsString({ message: 'Description must be string' })
  description!: string;
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members?: MemberDto[];
}

export class MemberDto {
  @IsString()
  userId!: string;

  @IsString()
  role!: WorkspaceRole;
}
