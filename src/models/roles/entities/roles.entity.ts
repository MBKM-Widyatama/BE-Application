import { AppEntity } from '../../../libraries/common/entities/app-entity.abstract';
import { Entity, Column, OneToOne } from 'typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends AppEntity {
  @Column()
  name: string;

  @Column()
  is_active: boolean;

  @OneToOne(() => UserEntity, (user) => user.role_id)
  user: UserEntity;
}
