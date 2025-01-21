import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReservationTable1736069174850 implements MigrationInterface {
  name = 'UpdateReservationTable1736069174850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reservation_table\` (\`reservation_id\` varchar(255) NOT NULL, \`table_id\` varchar(36) NOT NULL, INDEX \`IDX_60a89d4a03b474dbd918b317b8\` (\`reservation_id\`), INDEX \`IDX_a8c8e6608e72192eb726d84dd3\` (\`table_id\`), PRIMARY KEY (\`reservation_id\`, \`table_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` ADD CONSTRAINT \`FK_60a89d4a03b474dbd918b317b8b\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`reservation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` ADD CONSTRAINT \`FK_a8c8e6608e72192eb726d84dd30\` FOREIGN KEY (\`table_id\`) REFERENCES \`table\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` DROP FOREIGN KEY \`FK_a8c8e6608e72192eb726d84dd30\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` DROP FOREIGN KEY \`FK_60a89d4a03b474dbd918b317b8b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a8c8e6608e72192eb726d84dd3\` ON \`reservation_table\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_60a89d4a03b474dbd918b317b8\` ON \`reservation_table\``,
    );
    await queryRunner.query(`DROP TABLE \`reservation_table\``);
  }
}
