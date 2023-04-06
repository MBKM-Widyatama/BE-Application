import { IsString, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsBoolean()
  is_active: boolean;
}
