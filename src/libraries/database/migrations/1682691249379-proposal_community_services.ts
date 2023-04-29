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

export class proposalCommunityServices1682691249379
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'proposal_community_services',
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
            name: 'letter_partner_willingness',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'letter_assignment',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'document_proposal',
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

    await queryRunner.addColumns('proposal_community_services', [
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

    await queryRunner.createForeignKeys('proposal_community_services', [
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
    const table = await queryRunner.getTable('proposal_community_services');
    const foreignKeys = ['user_id', 'leader_id', 'participant_id', 'schema_id'];

    foreignKeys.forEach(async (key) => {
      const isKeyExists = table.foreignKeys.find((fk) =>
        fk.columnNames.includes(key),
      );

      if (isKeyExists) {
        await queryRunner.dropForeignKey(
          'proposal_community_services',
          isKeyExists,
        );
      }
      await queryRunner.dropColumn('proposal_community_services', key);
    });

    await queryRunner.dropTable('proposal_community_services');
  }
}
