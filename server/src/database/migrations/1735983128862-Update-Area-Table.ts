import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAreaTable1735983128862 implements MigrationInterface {
  name = 'UpdateAreaTable1735983128862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`area\` ADD \`is_full\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD \`is_reserved\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`table\` DROP COLUMN \`is_reserved\``,
    );
    await queryRunner.query(`ALTER TABLE \`area\` DROP COLUMN \`is_full\``);
  }
}
