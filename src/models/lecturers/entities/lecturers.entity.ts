import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { FacultiesEntity } from 'src/models/faculties/entities/faculties.entity';

enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum MaritalStatus {
  MARRIED = 'MARRIED',
  UNMARRIED = 'UNMARRIED',
}

@Entity({ name: 'lecturer' })
export class LecturerEntity extends AppEntity {
  @Column()
  public faculty_id: string;

  @Column()
  public name: string;

  @Column({ unique: true })
  public nrk: bigint;

  @Column({ unique: true })
  public nidn: bigint;

  @Column()
  public profile_picture: string;

  @Column({ enum: [Sex.MALE, Sex.FEMALE], enumName: 'sexEnumeration' })
  public sex: Sex;

  @Column({
    enum: [MaritalStatus.MARRIED, MaritalStatus.UNMARRIED],
    enumName: 'maritalStatusEnumeration',
    default: `'${MaritalStatus.UNMARRIED}'`,
  })
  public marital_status: MaritalStatus;

  /**
   * Relations
   */
  @OneToOne(() => FacultiesEntity, (faculty) => faculty.id)
  @JoinColumn({ name: 'faculty_id' })
  public faculty: FacultiesEntity;
}
