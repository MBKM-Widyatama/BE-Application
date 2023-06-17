import { AppEntity } from '../../../libraries/common/entities/app-entity.abstract';
import { Entity, Column, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends AppEntity {
  @Column()
  name: string;

  @Column()
  is_active: boolean;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
