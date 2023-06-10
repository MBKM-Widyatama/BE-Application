import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { LecturerEntity } from 'src/models/lecturers/entities/lecturers.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'faculties' })
export class FacultiesEntity extends AppEntity {
  @Column()
  @Exclude()
  public leader_id: string;

  @Column()
  public name: string;

  /**
   * Relations
   */
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'leader_id' })
  public leader: UserEntity;

  @OneToMany(() => LecturerEntity, (lecturer) => lecturer.faculty_id)
  public lecturer: LecturerEntity[];
}
