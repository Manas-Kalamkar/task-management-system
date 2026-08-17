import { IsEnum, IsString, MinLength } from 'class-validator';
import { TaskUpdateType } from '../../generated/prisma/enums';

export class CreateTaskUpdateDto {
  @IsString()
  @MinLength(1)
  userId!: string;

  @IsEnum(TaskUpdateType)
  type!: TaskUpdateType;

  @IsString()
  @MinLength(1)
  message!: string;
}