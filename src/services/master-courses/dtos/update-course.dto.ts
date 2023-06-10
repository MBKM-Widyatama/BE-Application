import { Allow, IsString, IsUUID, IsOptional } from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class UpdateCourseDto {
  @Allow()
  context?: {
    params: any;
    query: any;
    user: any;
  };

  @IsString()
  @IsUUID()
  @IsOptional()
  leader_id: string;

  @IsString()
  @IsExists('courses', 'name')
  name: string;
}
