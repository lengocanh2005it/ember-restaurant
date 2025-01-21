import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderTable1735658469272 implements MigrationInterface {
  name = 'UpdateOrderTable1735658469272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`admin_message\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`admin_message\``,
    );
  }
}
