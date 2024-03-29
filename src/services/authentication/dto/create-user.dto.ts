import {
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { REGEX_PASSWORD } from 'src/libraries/common';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  public role_id: string;

  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  // Vaidate password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  @IsString()
  @MinLength(8)
  @Matches(REGEX_PASSWORD, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public password: string;
}
