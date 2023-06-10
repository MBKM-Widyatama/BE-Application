import { Allow, IsNotEmpty, IsString } from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class UpdateCategorialNewsDto {
  @Allow()
  public context?: {
    params: any;
    query: any;
    user: any;
  };

  @IsString()
  @IsNotEmpty()
  @IsExists('categorial_news', 'name', 'id')
  public name: string;
}
