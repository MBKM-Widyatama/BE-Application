import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { REGEX_PASSWORD } from 'src/libraries/common';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  public token: string;

  // Vaidate password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  @IsString()
  @MinLength(8)
  @Matches(REGEX_PASSWORD, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  public password: string;
}
