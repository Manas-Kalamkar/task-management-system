import { IsOptional, isString, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email!: string;

  @IsString()
  @MinLength(1)
  username!: string;

  @IsString()
  @MinLength(1)
  fullName!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsString()
  password!: string;

}