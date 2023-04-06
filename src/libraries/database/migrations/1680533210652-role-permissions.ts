import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class rolePermissions1680533210652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'role_permissions',
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
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.addColumns('role_permissions', [
      new TableColumn({
        name: 'role_id',
        type: 'uuid',
        isNullable: false,
      }),

      new TableColumn({
        name: 'permission_id',
        type: 'uuid',
        isNullable: false,
      }),
    ]);

    await queryRunner.createForeignKeys('role_permissions', [
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('role_permissions');
    const foreignKeyRole = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('role_id') !== -1,
    );
    const foreignKeyPermission = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('permission_id') !== -1,
    );
    await queryRunner.dropForeignKey('role_permissions', foreignKeyRole);
    await queryRunner.dropForeignKey('role_permissions', foreignKeyPermission);
    await queryRunner.dropColumns('role_permissions', [
      'role_id',
      'permission_id',
    ]);
    await queryRunner.dropTable('role_permissions');
  }
}
