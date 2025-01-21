import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTicketMessageTableAndSupportTicketAndUserTables1736864414355
  implements MigrationInterface
{
  name = 'UpdateTicketMessageTableAndSupportTicketAndUserTables1736864414355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP FOREIGN KEY \`FK_ecec3086507fbe669b0e5917e62\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket_message\` (\`id\` varchar(36) NOT NULL, \`message\` varchar(255) NOT NULL, \`sender_type\` enum ('user', 'admin') NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`support_ticket_id\` varchar(36) NULL, \`sender_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP COLUMN \`request\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP COLUMN \`response\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP COLUMN \`admin_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD \`original_request\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` ADD CONSTRAINT \`FK_36a370fcfdb4015326b72f92f65\` FOREIGN KEY (\`support_ticket_id\`) REFERENCES \`support_ticket\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` ADD CONSTRAINT \`FK_3eeba4ad434505c799742d233fb\` FOREIGN KEY (\`sender_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` DROP FOREIGN KEY \`FK_3eeba4ad434505c799742d233fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` DROP FOREIGN KEY \`FK_36a370fcfdb4015326b72f92f65\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP COLUMN \`original_request\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD \`admin_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD \`response\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD \`request\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`ticket_message\``);
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD CONSTRAINT \`FK_ecec3086507fbe669b0e5917e62\` FOREIGN KEY (\`admin_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
