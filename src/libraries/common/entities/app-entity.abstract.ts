// base.entity.ts
import { Exclude } from 'class-transformer';
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
    name: 'created_at',
    type: 'bigint',
    readonly: true,
  })
  public created_at: number;

  @Column({
    name: 'created_by',
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  public created_by: string;

  @Column({
    name: 'created_by_id',
    type: 'uuid',
    nullable: true,
  })
  @Exclude()
  public created_by_id: string;

  @Column({
    name: 'updated_at',
    type: 'bigint',
    nullable: true,
  })
  public updated_at: number;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  public updated_by: string;

  @Column({
    name: 'updated_by_id',
    type: 'uuid',
    nullable: true,
  })
  @Exclude()
  public updated_by_id: string;

  @Column({
    name: 'deleted_at',
    type: 'bigint',
    nullable: true,
  })
  public deleted_at: number;

  @Column({
    name: 'deleted_by',
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  public deleted_by: string;

  @Column({
    name: 'deleted_by_id',
    type: 'uuid',
    nullable: true,
  })
  @Exclude()
  public deleted_by_id: string;

  /**
   * Hooks
   */
  @BeforeInsert()
  public setCreatedAt() {
    this.created_at = Math.floor(Date.now() / 1000);
    this.updated_at = Math.floor(Date.now() / 1000);
  }

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updated_at = Math.floor(Date.now() / 1000);
  }
}
