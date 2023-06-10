import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'categorial_news' })
export class CategorialNewsEntity extends AppEntity {
  @Column()
  public name: string;
}
