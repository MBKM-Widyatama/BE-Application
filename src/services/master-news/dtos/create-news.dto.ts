import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class CreateNewsDto {
  @IsString()
  @IsOptional()
  @IsUUID()
  @IsArray()
  public categories_id: string[];

  @IsString()
  @IsNotEmpty()
  @IsExists('news', 'title')
  public title: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsOptional()
  public thumbnail: any;
}
