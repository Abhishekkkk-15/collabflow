import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectMemberDto } from './project-member.dto';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string; // required

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

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
