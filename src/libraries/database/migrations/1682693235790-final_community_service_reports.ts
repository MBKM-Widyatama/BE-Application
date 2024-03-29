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

export class finalCommunityServiceReports1682693235790
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'final_community_service_reports',
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
            name: 'partner_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'partner_address',
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
            isNullable: true,
          },
          {
            name: 'online_mass_media_link',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'hki_certificate',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'other_output',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'final_report',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'financial_report',
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

    await queryRunner.addColumns('final_community_service_reports', [
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
        name: 'participant_id',
        type: 'uuid',
        isNullable: false,
      }),

      new TableColumn({
        name: 'schema_id',
        type: 'uuid',
        isNullable: false,
      }),
    ]);

    await queryRunner.createForeignKeys('final_community_service_reports', [
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
        referencedTableName: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['participant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'participants',
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
    const table = await queryRunner.getTable('final_community_service_reports');
    const foreignKeys = ['user_id', 'leader_id', 'participant_id', 'schema_id'];

    foreignKeys.forEach(async (key) => {
      const isKeyExists = table.foreignKeys.find((fk) =>
        fk.columnNames.includes(key),
      );

      if (isKeyExists) {
        await queryRunner.dropForeignKey(
          'final_community_service_reports',
          isKeyExists,
        );
      }
      await queryRunner.dropColumn('final_community_service_reports', key);
    });

    await queryRunner.dropTable('final_community_service_reports');
  }
}
