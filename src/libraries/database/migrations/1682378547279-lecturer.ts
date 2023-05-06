import { MigrationInterface, QueryRunner, Table } from 'typeorm';

enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

enum MaritalStatus {
  MARRIED = 'MARRIED',
  UNMARRIED = 'UNMARRIED',
}

export class lecturer1682378547279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'lecturer',
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
            name: 'nrk',
            type: 'bigint',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'nidn',
            type: 'bigint',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'profile_picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sex',
            type: 'enum',
            enum: [Sex.MALE, Sex.FEMALE],
            enumName: 'sexEnumeration',
            isNullable: false,
          },
          {
            name: 'marital_status',
            type: 'enum',
            enum: [MaritalStatus.MARRIED, MaritalStatus.UNMARRIED],
            enumName: 'maritalStatusEnumeration',
            isNullable: false,
            default: `'${MaritalStatus.UNMARRIED}'`,
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
    await queryRunner.dropTable('lecturer');
  }
}
