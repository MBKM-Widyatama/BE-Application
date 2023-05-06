import { MigrationInterface, QueryRunner, Table } from 'typeorm';

enum semesterOptions {
  GANJIL = 'GANJIL',
  GENAP = 'GENAP',
}

export class researchProposal1682689859490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'research_proposal',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('research_proposal');
    const foreignKeys = ['user_id', 'leader_id', 'participant_id', 'schema_id'];

    foreignKeys.forEach(async (key) => {
      const isKeyExists = table.foreignKeys.find((fk) =>
        fk.columnNames.includes(key),
      );

      if (isKeyExists) {
        await queryRunner.dropForeignKey('research_proposal', isKeyExists);
      }
      await queryRunner.dropColumn('research_proposal', key);
    });

    await queryRunner.dropTable('research_proposal');
  }
}
