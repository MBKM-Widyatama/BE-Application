import { IsString, IsUUID, IsOptional } from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class CreateCourseDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  leader_id: string;

  @IsString()
  @IsExists('courses', 'name')
  name: string;
}
