import { IsString } from 'class-validator';

export class CreateTaskMemberDto {
  @IsString()
  userId!: string;
}