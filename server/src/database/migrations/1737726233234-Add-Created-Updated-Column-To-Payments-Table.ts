import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedUpdatedColumnToPaymentsTable1737726233234 implements MigrationInterface {
    name = 'AddCreatedUpdatedColumnToPaymentsTable1737726233234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`createdAt\``);
    }

}
