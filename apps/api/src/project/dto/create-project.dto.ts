import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectMemberDto } from './project-member.dto';
import { Priority, ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;
  @IsEnum(Priority)
  priority!: Priority;
  @IsEnum(ProjectStatus)
  status!: ProjectStatus;
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectMemberDto)
  members?: CreateProjectMemberDto[];
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;
}
