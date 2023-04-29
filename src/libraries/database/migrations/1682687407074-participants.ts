import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class participants1682687407074 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'participants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'created_at',
            type: 'bigint',
            isNullable: false,
            default: Math.floor(Date.now() / 1000),
          },
          {
            name: 'updated_at',
            type: 'bigint',
            isNullable: false,
            default: Math.floor(Date.now() / 1000),
          },
          {
            name: 'deleted_at',
            type: 'bigint',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.addColumns('participants', [
      new TableColumn({
        name: 'member_id',
        type: 'uuid',
        isNullable: true,
      }),

      new TableColumn({
        name: 'student_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('participants', [
      new TableForeignKey({
        columnNames: ['member_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lecturer',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['student_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'students',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('participants');
    const foreignKeyMemberId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('member_id') !== -1,
    );
    const foreignKeyStudentId = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('student_id') !== -1,
    );

    await queryRunner.dropForeignKey('participants', foreignKeyMemberId);
    await queryRunner.dropForeignKey('participants', foreignKeyStudentId);
    await queryRunner.dropColumns('participants', ['member_id', 'student_id']);
    await queryRunner.dropTable('participants');
  }
}
