import {
  Allow,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class UpdateNewsDto {
  @Allow()
  public context?: {
    params: any;
    query: any;
    user: any;
  };

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
  @IsArray()
  public pictures: any[];
}
