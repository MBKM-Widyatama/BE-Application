import { AppEntity } from '../../../libraries/common/entities';
import { Entity, Column, BeforeInsert, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../../roles/entities/roles.entity';
import { FacultiesEntity } from '../../faculties/entities/faculties.entity';

dotenv.config();

@Entity({ name: 'users' })
export class UserEntity extends AppEntity {
  @Column({
    name: 'role_id',
    type: 'uuid',
    nullable: false,
  })
  @Exclude()
  public role_id: string;

  @Column({
    name: 'faculty_id',
    type: 'uuid',
    nullable: true,
  })
  @Exclude()
  public faculty_id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  public name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  public email: string;

  @Column({
    name: 'email_verified_otp',
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  public email_verification_otp: string;

  @Column({
    name: 'email_verified_valid_to',
    type: 'bigint',
    nullable: true,
  })
  @Exclude()
  public email_verification_valid_to: number;

  @Column({
    name: 'email_verified_at',
    type: 'bigint',
    nullable: true,
  })
  public email_verified_at: number;

  @Column({
    name: 'phone_code',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  public phone_code: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  public phone_number: string;

  @Column({
    name: 'profile_picture',
    type: 'varchar',
    nullable: true,
  })
  public profile_picture: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
  })
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
  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;

  @ManyToOne(() => FacultiesEntity, (faculty) => faculty.users)
  @JoinColumn({ name: 'faculty_id' })
  public faculty: FacultiesEntity;
}
