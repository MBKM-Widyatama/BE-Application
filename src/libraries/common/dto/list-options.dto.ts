import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min, ValidateIf } from 'class-validator';
import { TRUE_VALUE } from '../constants';

export class ListOptionDto {
  @IsOptional()
  public search: string;

  @ValidateIf((o) => o.isDeleted)
  @IsOptional()
  @Transform(({ value }) => TRUE_VALUE.includes(value))
  public isDeleted?: boolean = false;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  public limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public offset?: number = 1;

  @ApiPropertyOptional({
    example: 'created_at|ASC',
  })
  public sort?: string = 'created_at|ASC';

  @Transform(({ value }) => TRUE_VALUE.includes(value))
  public disablePaginate?: boolean = false;

  get skip(): number {
    return (this.offset - 1) * this.limit;
  }
}
