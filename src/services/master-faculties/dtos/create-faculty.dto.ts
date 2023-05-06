import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateFacultyDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  leader_id: string;

  @IsString()
  name: string;
}
