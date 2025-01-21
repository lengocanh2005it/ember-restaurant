import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSupportTicketAndUserTable1736857444898
  implements MigrationInterface
{
  name = 'UpdateSupportTicketAndUserTable1736857444898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD \`admin_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD CONSTRAINT \`FK_ecec3086507fbe669b0e5917e62\` FOREIGN KEY (\`admin_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP FOREIGN KEY \`FK_ecec3086507fbe669b0e5917e62\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP COLUMN \`admin_id\``,
    );
  }
}
