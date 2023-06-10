import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FacultiesEntity } from 'src/models/faculties/entities/faculties.entity';
import { MaritalStatusEnumeraton, SexEnumeration } from 'src/libraries/common';
import { Exclude } from 'class-transformer';

@Entity({ name: 'lecturer' })
export class LecturerEntity extends AppEntity {
  @Column()
  @Exclude()
  public faculty_id: string;

  @Column()
  @Exclude()
  public course_id: string;

  @Column()
  public name: string;

  @Column({ unique: true })
  public nrk: number;

  @Column({ unique: true })
  public nidn: number;

  @Column()
  public profile_picture: string;

  @Column({
    enum: [SexEnumeration.MALE, SexEnumeration.FEMALE],
    enumName: 'sexEnumeration',
  })
  public sex: SexEnumeration;

  @Column({
    enum: [MaritalStatusEnumeraton.MARRIED, MaritalStatusEnumeraton.UNMARRIED],
    enumName: 'maritalStatusEnumeration',
    default: `'${MaritalStatusEnumeraton.UNMARRIED}'`,
  })
  public marital_status: MaritalStatusEnumeraton;

  /**
   * Relations
   */
  @ManyToOne(() => FacultiesEntity, (faculty) => faculty.id)
  @JoinColumn({ name: 'faculty_id' })
  public faculty: FacultiesEntity;
}
