// base.entity.ts
// import { Exclude } from 'class-transformer';
import {
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  BeforeInsert,
  // VersionColumn,
} from 'typeorm';

export abstract class AppEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /*
   * Create, Update and Delete Date Columns
   */

  @Column({
    type: 'bigint',
    readonly: true,
  })
  public created_at: number;

  @Column({ type: 'bigint', nullable: true })
  public updated_at: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  public deleted_at: number;

  /**
   * Hooks
   */

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updated_at = Math.floor(Date.now() / 1000);
  }

  @BeforeInsert()
  public setCreatedAt() {
    this.created_at = Math.floor(Date.now() / 1000);
    this.updated_at = Math.floor(Date.now() / 1000);
  }
}
