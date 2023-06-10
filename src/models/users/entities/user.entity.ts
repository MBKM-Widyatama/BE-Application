import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../../roles/entities/roles.entity';
import { FacultiesEntity } from '../../faculties/entities/faculties.entity';

dotenv.config();

@Entity({ name: 'users' })
export class UserEntity extends AppEntity {
  @Column({ nullable: true })
  @Exclude()
  public role_id: string;

  @Column()
  public faculty_id: string;

  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude()
  public email_verification_otp: string;

  @Column({ type: 'bigint', nullable: true })
  @Exclude()
  public email_verification_valid_to: number;

  @Column({ type: 'bigint', nullable: true })
  public email_verified_at: number;

  @Column({ length: 5, nullable: true })
  public phone_code: string;

  @Column({ length: 15, nullable: true, unique: true })
  public phone_number: string;

  @Column({ nullable: true })
  public profile_picture: string;

  @Column()
  @Exclude()
  public password: string;

  /**
   * Hooks
   */
  @BeforeInsert()
  public async hashPasswordOnCreate() {
    if (this.password) {
      const hash = await bcrypt.hash(
        this.password,
        +process.env.APP_BCRYPT_SALT_OR_ROUND,
      );
      this.password = hash;
    }
  }

  /**
   * Relations
   */
  @OneToOne(() => RoleEntity, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;

  @OneToOne(() => FacultiesEntity, (faculty) => faculty.id)
  @JoinColumn({ name: 'faculty_id' })
  public faculty: FacultiesEntity;
}
