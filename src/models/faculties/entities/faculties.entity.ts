import { AppEntity } from 'src/libraries/common';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';

@Entity({ name: 'faculties' })
export class FacultiesEntity extends AppEntity {
  @Column()
  public leader_id: string;

  @Column()
  public name: string;

  /**
   * Relations
   */
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'leader_id' })
  public leader: UserEntity;
}
