import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

enum semesterOptions {
  GANJIL = 'GANJIL',
  GENAP = 'GENAP',
}

export class researchProgressReport1682691750480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'research_progress_report',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'semester',
            type: 'enum',
            enum: [semesterOptions.GANJIL, semesterOptions.GENAP],
            enumName: 'semesterEnumeration',
            isNullable: false,
            default: `'${semesterOptions.GANJIL}'`,
          },
          {
            name: 'academic_year',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'progress_report',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'full_papper',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'loa',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'journal_link',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'hki_certificate',
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

    await queryRunner.addColumns('research_progress_report', [
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),

      new TableColumn({
        name: 'leader_id',
        type: 'uuid',
        isNullable: false,
      }),

      new TableColumn({
        name: 'schema_id',
        type: 'uuid',
        isNullable: false,
      }),
    ]);

    await queryRunner.createForeignKeys('research_progress_report', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['leader_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lecturer',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['schema_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'schemas',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('research_progress_report');
    const foreignKeys = ['user_id', 'leader_id', 'schema_id'];

    foreignKeys.forEach(async (key) => {
      const isKeyExists = table.foreignKeys.find((fk) =>
        fk.columnNames.includes(key),
      );

      if (isKeyExists) {
        await queryRunner.dropForeignKey(
          'research_progress_report',
          isKeyExists,
        );
      }
      await queryRunner.dropColumn('research_progress_report', key);
    });

    await queryRunner.dropTable('research_progress_report');
  }
}
