import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnReservationTable1736072106835
  implements MigrationInterface
{
  name = 'UpdateColumnReservationTable1736072106835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD \`admin_message\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP COLUMN \`admin_message\``,
    );
  }
}
