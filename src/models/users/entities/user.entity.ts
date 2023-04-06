import { AppEntity } from '../../../libraries/common/entities/app-entity.abstract';
import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Roles } from '../../roles/entities/roles.entity';

dotenv.config();

@Entity({ name: 'users' })
export class Users extends AppEntity {
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
      // console.log(
      //   'process.env.APP_BCRYPT_SALT_OR_ROUND',
      //   process.env.APP_BCRYPT_SALT_OR_ROUND,
      // );
      // console.log(this.password, 'pass')
      // const saltOrRounds = process.env.APP_BCRYPT_SALT_OR_ROUND;
      const hash = await bcrypt.hash(this.password, 11);
      this.password = hash;
    }
  }
}
