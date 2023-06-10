import { IsString, IsUUID, IsOptional } from 'class-validator';
import { IsExists } from 'src/libraries/common';

export class CreateFacultyDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  leader_id: string;

  @IsString()
  @IsExists('faculties', 'name')
  name: string;
}
