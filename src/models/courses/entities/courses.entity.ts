import { AppEntity } from 'src/libraries/common';
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { LecturerEntity } from 'src/models/lecturers/entities/lecturers.entity';

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
