import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { CategorialNewsEntity } from 'src/models/categorial-news/entities/categorial-news.entity';

@Entity({ name: 'news' })
export class NewsEntity extends AppEntity {
  @Column()
  @Exclude()
  public user_id: string;

  @Column()
  @Exclude()
  public category_id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  /**
   * Relations
   */
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @OneToMany(() => CategorialNewsEntity, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  public categories: CategorialNewsEntity[];
}
