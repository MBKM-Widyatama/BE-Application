import { AppEntity } from '../../../libraries/common/entities/app-entity.abstract';
import { Entity, Column, BeforeInsert, Index } from 'typeorm';

@Entity()
export class SingleSignOn extends AppEntity {
  @Column({ type: 'text' })
  public token: string;

  @Column({ type: 'text', nullable: true })
  public tokenExternal: string;

  @Column()
  public userId: string;

  @Column()
  public userType: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  public validTo: number;

  @Column({
    nullable: true,
  })
  public ip: string;

  @Column({
    nullable: true,
  })
  public access: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @Index()
  public menu: any;

  /**
   * Hooks
   */

  @BeforeInsert()
  public setValidTo() {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + 1);

    this.validTo = Math.floor(date.getTime() / 1000);
  }
}
