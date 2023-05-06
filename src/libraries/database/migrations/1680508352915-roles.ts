import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class roles1680508352915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
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
            isUnique: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
						name: 'created_at',
						type: 'bigint',
						isNullable: false,
            default: Math.floor(Date.now() / 1000)
					},
					{
						name: 'updated_at',
						type: 'bigint',
						isNullable: false,
            default: Math.floor(Date.now() / 1000)
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
    await queryRunner.dropTable('roles');
  }
}
