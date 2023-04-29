import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addRelationsUsers1682695799660 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'role_id',
        type: 'uuid',
        isNullable: false,
      }),

      new TableColumn({
        name: 'lecture_id',
        type: 'uuid',
        isNullable: true,
      }),

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

    await queryRunner.createForeignKeys('users', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['lecture_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lecturer',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

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
