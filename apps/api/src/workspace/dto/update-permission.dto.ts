import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';

class WorkspacePermissionDto {
  @IsBoolean()
  canCreateProject!: boolean;

  @IsBoolean()
  canInviteMembers!: boolean;

  @IsBoolean()
  canModifySettings!: boolean;

  @IsBoolean()
  canDeleteResources!: boolean;
}

export class UpdatePermissinDto extends PartialType(WorkspacePermissionDto) {}
