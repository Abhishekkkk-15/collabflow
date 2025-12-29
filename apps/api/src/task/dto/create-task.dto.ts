import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
  ValidateNested,
} from 'class-validator';

import {
  ETaskStatus,
  ETaskPriority,
  ETaskTag,
  TaskStatus,
} from '@collabflow/types';
import { Type } from 'class-transformer';
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

  @ValidateNested({ each: true })
  @Type(() => AssigneToUser)
  assignedTo!: AssigneToUser[];

  @IsOptional()
  @IsString()
  projectId?: string;
}

export class AssigneToUser {
  @IsString()
  id!: string;
  @IsString()
  name!: string;
  @IsString()
  email!: string;
  @IsString()
  image!: string;
}
