import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { NewsEntity } from '../../../models/news/entities/news.entity';

@Entity({ name: 'categorial_news' })
export class CategorialNewsEntity extends AppEntity {
  @Column({ name: 'news_id', type: 'uuid', nullable: false })
  @Exclude()
  public news_id: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  public name: string;

  /**
   * Relations
   */
  @Exclude()
  @ManyToOne(() => NewsEntity, (news) => news.id)
  public news: NewsEntity;
}
