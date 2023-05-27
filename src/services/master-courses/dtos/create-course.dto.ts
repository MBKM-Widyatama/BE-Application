import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  leader_id: string;

  @IsString()
  name: string;
}
