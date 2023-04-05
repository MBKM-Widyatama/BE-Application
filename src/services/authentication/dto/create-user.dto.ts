import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // Vaidate password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  @IsString()
  @MinLength(6)
  password: string;
}
