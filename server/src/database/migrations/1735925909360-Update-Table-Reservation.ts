import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableReservation1735925909360 implements MigrationInterface {
  name = 'UpdateTableReservation1735925909360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD \`total_price\` float NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP COLUMN \`total_price\``,
    );
  }
}
