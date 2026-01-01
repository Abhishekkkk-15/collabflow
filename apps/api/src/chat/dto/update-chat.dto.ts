import { IsString, MinLength } from 'class-validator';

export class UpdateChatDto {
  @IsString()
  @MinLength(1)
  content!: string;
}
