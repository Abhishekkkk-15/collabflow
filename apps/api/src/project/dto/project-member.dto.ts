import { IsString, IsIn } from 'class-validator';
import { type ProjectRole } from '@collabflow/types';
import { PROJECT_ROLE_VALUES } from '@collabflow/types';
export class CreateProjectMemberDto {
  @IsString()
  userId!: string;

  @IsIn(PROJECT_ROLE_VALUES)
  role!: ProjectRole;
}
