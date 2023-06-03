import { AppEntity } from 'src/libraries/common';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'categorial_news' })
export class CategorialNewsEntity extends AppEntity {
  @Column()
  public name: string;
}
