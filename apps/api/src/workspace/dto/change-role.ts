import { WorkspaceRole } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty({ message: "Name can't be empty" })
  @IsString({ message: 'Name must be string' })
  id!: string;
  @IsNotEmpty({ message: "Name can't be empty" })
  @IsString({ message: 'Name must be string' })
  workspaceId!: string;

  @IsString()
  role!: WorkspaceRole;
}
