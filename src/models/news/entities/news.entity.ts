import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToMany } from 'typeorm';
import { CategorialNewsEntity } from '../../../models/categorial-news/entities/categorial-news.entity';

@Entity({ name: 'news' })
export class NewsEntity extends AppEntity {
  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  public title: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  public content: string;

  @Column({
    name: 'thumbnail',
    type: 'varchar',
    nullable: true,
  })
  public thumbnail: string;

  @OneToMany(() => CategorialNewsEntity, (category) => category.news)
  public categories: CategorialNewsEntity[];
}
