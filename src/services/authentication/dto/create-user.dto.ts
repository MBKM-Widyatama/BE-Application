import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { IsProtectXSSAttacks } from 'src/libraries/decorators/validations/protect-xss.validator';

const regExpIsContainAlpha = /[A-Z]+/;
const regExpIsContainNumber = /[0-9]+/;
const regExpIsNotContainNumber = /[^0-9]+/;
const regExpIsContainSpecialCharacters =
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const regExpIsNotContainTagHtml = /(<([^>]+)>)/gi;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(regExpIsNotContainNumber, {
    message: 'name must not contain number',
  })
  @Matches(regExpIsNotContainTagHtml, {
    message: 'name must not contain tag html',
  })
  @IsProtectXSSAttacks('name')
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // Vaidate password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(regExpIsContainAlpha, {
    message: 'password must contain at least one alphabet',
  })
  @Matches(regExpIsContainNumber, {
    message: 'password must contain at least one number',
  })
  @Matches(regExpIsContainSpecialCharacters, {
    message: 'password must contain at least one special character',
  })
  password: string;
}
