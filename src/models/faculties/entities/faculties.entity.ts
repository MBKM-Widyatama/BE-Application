import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToOne } from 'typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { LecturerEntity } from 'src/models/lecturers/entities/lecturers.entity';

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
  public leader: UserEntity;

  @OneToOne(() => LecturerEntity, (lecturer) => lecturer.faculty_id)
  public lecturer: LecturerEntity;
}
