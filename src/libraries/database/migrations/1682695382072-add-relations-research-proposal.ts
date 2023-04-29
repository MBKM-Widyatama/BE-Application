import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addRelationsResearchProposal1682695382072
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('research_proposal', [
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

    await queryRunner.createForeignKeys('research_proposal', [
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

  public async down(): Promise<void> {
    //
  }
}
