import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTable1736358260239 implements MigrationInterface {
  name = 'UpdateUsersTable1736358260239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`theme\` \`theme\` enum ('dark', 'light') NOT NULL DEFAULT 'dark'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`theme\` \`theme\` enum ('dark', 'light') NOT NULL DEFAULT 'light'`,
    );
  }
}
