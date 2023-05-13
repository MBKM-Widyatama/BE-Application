import {
  IsString,
  IsUUID,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import {
  IsExists,
  MaritalStatusEnumeraton,
  SexEnumeration,
} from 'src/libraries/common';

export class CreateLecturerDto {
  @IsOptional()
  @IsUUID()
  public faculty_id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsExists('lecturer', 'nrk')
  public nrk: number;

  @IsNotEmpty()
  @IsNumber()
  @IsExists('lecturer', 'nidn')
  public nidn: number;

  @IsOptional()
  @IsString()
  public profile_picture: string;

  @IsEnum(SexEnumeration)
  @IsNotEmpty()
  public sex: SexEnumeration;

  @IsEnum(MaritalStatusEnumeraton)
  @IsNotEmpty()
  public marital_status: MaritalStatusEnumeraton;
}
