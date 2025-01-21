import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTypeColumns1735982241068 implements MigrationInterface {
  name = 'UpdateTypeColumns1735982241068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD \`price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`amount\``);
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`amount\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD \`total_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`discount\` DROP COLUMN \`value\``);
    await queryRunner.query(
      `ALTER TABLE \`discount\` ADD \`value\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`total_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` DROP COLUMN \`unit_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD \`unit_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD \`total_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`price\` decimal(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`price\``);
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`price\` float(12) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD \`total_price\` float(12) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` DROP COLUMN \`unit_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD \`unit_price\` float(12) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`total_price\` float(12) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`discount\` DROP COLUMN \`value\``);
    await queryRunner.query(
      `ALTER TABLE \`discount\` ADD \`value\` float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD \`total_price\` float(12) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`amount\``);
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`amount\` float(12) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`table\` DROP COLUMN \`price\``);
  }
}
