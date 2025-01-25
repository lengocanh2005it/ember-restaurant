import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePaymentTables1737719484513 implements MigrationInterface {
  name = 'UpdatePaymentTables1737719484513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`description\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP COLUMN \`description\``,
    );
  }
}
