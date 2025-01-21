import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpateTablesTable1736001723873 implements MigrationInterface {
  name = 'UpateTablesTable1736001723873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD \`type\` enum ('normal', 'vip') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`table\` DROP COLUMN \`type\``);
  }
}
