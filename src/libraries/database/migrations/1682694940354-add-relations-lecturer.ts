import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addRelationsLecturer1682694940354 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('lecturer', [
      new TableColumn({
        name: 'course_id',
        type: 'uuid',
        isNullable: true,
      }),

      new TableColumn({
        name: 'faculty_id',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('lecturer', [
      new TableForeignKey({
        columnNames: ['course_id'],
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

  public async down(): Promise<void> {
    //
  }
}
