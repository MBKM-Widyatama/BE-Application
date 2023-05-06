import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class students1682685349714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'profile_picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: false,
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

    await queryRunner.addColumns('students', [
      new TableColumn({
        name: 'courses_id',
        type: 'uuid',
        isNullable: false,
      }),

      new TableColumn({
        name: 'faculty_id',
        type: 'uuid',
        isNullable: false,
      }),
    ]);

    await queryRunner.createForeignKeys('students', [
      new TableForeignKey({
        columnNames: ['courses_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'courses',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['faculty_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'faculties',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('students');
    const foreignKeyCourses = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('courses_id') !== -1,
    );
    const foreignKeyFaculty = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('faculty_id') !== -1,
    );

    await queryRunner.dropForeignKey('students', foreignKeyCourses);
    await queryRunner.dropForeignKey('students', foreignKeyFaculty);
    await queryRunner.dropColumns('students', ['courses_id', 'faculty_id']);
    await queryRunner.dropTable('students');
  }
}
