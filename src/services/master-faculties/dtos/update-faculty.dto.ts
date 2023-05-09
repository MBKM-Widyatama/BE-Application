import { IsExists } from 'src/libraries/common';
import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFacultyDto {
  @Allow()
  context: {
    params: any;
    query: any;
    user: any;
  };

  @IsOptional()
  @IsString()
  leader_id: string;

  @IsString()
  @IsNotEmpty()
  @IsExists('faculties', 'name')
  name: string;
}
