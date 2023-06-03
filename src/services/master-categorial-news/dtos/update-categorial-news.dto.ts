import { Allow, IsString } from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class UpdateCategorialNewsDto {
  @Allow()
  public context?: {
    query: any;
    params: any;
    user: any;
  };

  @IsString()
  @IsExists('categorial_news', 'name')
  public name: string;
}
