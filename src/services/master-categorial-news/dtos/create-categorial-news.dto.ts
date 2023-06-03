import { IsString } from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class CreateCategorialNewsDto {
  @IsString()
  @IsExists('categorial_news', 'name')
  public name: string;
}
