import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { LecturerEntity } from '../../lecturers/entities/lecturers.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'faculties' })
export class FacultiesEntity extends AppEntity {
  @Column({
    name: 'leader_id',
    type: 'uuid',
    nullable: true,
  })
  @Exclude()
  public leader_id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  public name: string;

  /**
   * Relations
   */
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'leader_id' })
  public leader: UserEntity;

  @OneToMany(() => LecturerEntity, (lecturer) => lecturer.faculty_id)
  public lecturer: LecturerEntity[];

  @OneToMany(() => UserEntity, (user) => user.faculty)
  public users: UserEntity[];
}
