import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabase1735637773627 implements MigrationInterface {
  name = 'UpdateDatabase1735637773627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`review_order\` DROP FOREIGN KEY \`FK_2265152c45c0a10ba900bb05e19\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_order\` ADD CONSTRAINT \`FK_2265152c45c0a10ba900bb05e19\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`review_order\` DROP FOREIGN KEY \`FK_2265152c45c0a10ba900bb05e19\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_order\` ADD CONSTRAINT \`FK_2265152c45c0a10ba900bb05e19\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
