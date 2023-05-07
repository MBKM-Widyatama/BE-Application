import { RoleEntity } from 'src/models/roles/entities/roles.entity';

export interface ICreateUser {
  role_id: string;
  name: string;
  email: string;
  password: string;
}

export interface IRequestUserPassport {
  id: string;
  email: string;
  name: string;
  role: RoleEntity;
}
