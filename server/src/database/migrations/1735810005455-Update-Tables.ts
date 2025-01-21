import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTables1735810005455 implements MigrationInterface {
  name = 'UpdateTables1735810005455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`promotion\` ADD \`discount_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion\` ADD CONSTRAINT \`FK_0fbf4831e38d71712613078809a\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discount\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`promotion\` DROP FOREIGN KEY \`FK_0fbf4831e38d71712613078809a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion\` DROP COLUMN \`discount_id\``,
    );
  }
}
