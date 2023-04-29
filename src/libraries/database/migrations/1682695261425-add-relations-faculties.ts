import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addRelationsFaculties1682695261425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'faculties',
      new TableColumn({
        name: 'leader_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'faculties',
      new TableForeignKey({
        columnNames: ['leader_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lecturer',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    //
  }
}
