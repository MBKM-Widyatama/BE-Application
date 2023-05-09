import { IsUUID } from 'class-validator';

export class DetailOptionDto {
  @IsUUID()
  public id: string;
}
