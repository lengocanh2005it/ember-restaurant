import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabase1738749261179 implements MigrationInterface {
  name = 'UpdateDatabase1738749261179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD \`discount_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD \`original_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`original_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`discount_price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`image\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`image\` text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`image\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`image\` varchar(255) NOT NULL DEFAULT 'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735465375/default_user_logo_b1f7pd.png'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`discount_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`original_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP COLUMN \`original_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP COLUMN \`discount_price\``,
    );
  }
}
