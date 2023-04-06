import { AppEntity } from '../../../libraries/common/entities/app-entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'roles' })
export class Roles extends AppEntity {
  @Column()
  name: string;

  @Column()
  is_active: boolean;
}
