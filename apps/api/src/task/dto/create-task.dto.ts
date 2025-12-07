import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
} from 'class-validator';

import {
  ETaskStatus,
  ETaskPriority,
  ETaskTag,
  TaskStatus,
} from '@collabflow/types';
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsEnum(ETaskTag, { each: true })
  @IsOptional()
  tags?: ETaskTag[];

  @IsEnum(ETaskStatus)
  status!: ETaskStatus;

  @IsEnum(ETaskPriority)
  priority!: ETaskPriority;

  @IsDateString()
  dueDate!: string;

  @IsArray()
  @ArrayNotEmpty()
  assignedTo!: string[];

  @IsString()
  workspaceId!: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}
