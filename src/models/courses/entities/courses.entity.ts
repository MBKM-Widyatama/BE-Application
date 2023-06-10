import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../../models/users/entities/user.entity';
import { LecturerEntity } from '../../../models/lecturers/entities/lecturers.entity';

@Entity({ name: 'courses' })
export class CoursesEntity extends AppEntity {
  @Column()
  public leader_id: string;

  @Column()
  public name: string;

  /**
   * Relations
   */
  @OneToOne(() => UserEntity, (user) => user.id)
  public leader: UserEntity;

  @OneToMany(() => LecturerEntity, (lecturer) => lecturer.course_id)
  public lecturer: LecturerEntity;
}
