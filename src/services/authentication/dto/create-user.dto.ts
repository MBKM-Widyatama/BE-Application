import {
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  role_id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // Vaidate password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  @IsString()
  @MinLength(6)
  password: string;
}
