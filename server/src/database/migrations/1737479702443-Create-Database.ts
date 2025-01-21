import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1737479702443 implements MigrationInterface {
  name = 'CreateDatabase1737479702443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`promotion\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`note\` varchar(255) NULL, \`discount_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_51ac9c3fe5a2ca61b9475fce02\` (\`title\`), UNIQUE INDEX \`IDX_969359329a22440d2b8f7d491d\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payment\` (\`id\` varchar(36) NOT NULL, \`payment_intent_id\` varchar(255) NULL, \`payment_method_id\` varchar(255) NULL, \`amount\` decimal(10,2) NOT NULL, \`payment_method\` enum ('cash', 'card') NOT NULL, \`type\` enum ('order', 'reservation') NOT NULL, \`currency\` enum ('usd', 'vnd') NOT NULL DEFAULT 'usd', \`status\` enum ('pending', 'success', 'error') NOT NULL DEFAULT 'pending', \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`review\` (\`id\` varchar(36) NOT NULL, \`rating_number\` int NULL, \`comment\` varchar(255) NOT NULL, \`type\` enum ('restaurant', 'order', 'reservation', 'product') NOT NULL, \`is_featured\` tinyint NOT NULL DEFAULT 0, \`date\` timestamp NOT NULL, \`user_id\` varchar(36) NULL, \`product_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`area\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`capacity\` int NOT NULL, \`is_full\` tinyint NOT NULL DEFAULT 0, \`floor_number\` int NOT NULL, \`status\` enum ('running', 'maintenance') NOT NULL DEFAULT 'running', \`operating_hours\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_644ffaf8fbde4db798cb47712f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`table\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`note\` varchar(255) NULL, \`capacity\` int NOT NULL, \`status\` enum ('running', 'maintenance') NOT NULL DEFAULT 'running', \`is_reserved\` tinyint NOT NULL DEFAULT 0, \`price\` decimal(10,2) NOT NULL, \`type\` enum ('normal', 'vip') NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`area_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reservation\` (\`id\` varchar(255) NOT NULL, \`date_time\` timestamp NOT NULL, \`is_paid\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('pending', 'success', 'error') NOT NULL DEFAULT 'pending', \`guests_count\` int NOT NULL, \`note\` varchar(255) NULL, \`total_price\` decimal(10,2) NOT NULL, \`admin_message\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`payment_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_5c2dde2fd3e7b093822c5ad3ff\` (\`payment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_discount\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`status\` enum ('used', 'unused') NOT NULL DEFAULT 'unused', \`date_used\` timestamp NULL, \`user_id\` varchar(36) NULL, \`discount_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`discount\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('percentage', 'fixed') NOT NULL, \`value\` int NOT NULL, \`description\` varchar(255) NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`is_active\` tinyint NOT NULL, \`currency\` enum ('vnd', 'usd') NOT NULL DEFAULT 'usd', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` varchar(255) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`status\` enum ('pending', 'success', 'error') NOT NULL DEFAULT 'pending', \`delivery_address\` varchar(255) NULL, \`is_paid\` tinyint NOT NULL DEFAULT 0, \`delivery_method\` enum ('home_delivery', 'pick_up') NOT NULL, \`note\` varchar(255) NULL, \`admin_message\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`payment_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_28c756d4fd41223fedfbd2750e\` (\`payment_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_product\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`unit_price\` decimal(10,2) NOT NULL, \`total_price\` decimal(10,2) NOT NULL, \`note\` varchar(255) NULL, \`order_id\` varchar(255) NULL, \`product_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`category\` enum ('appetizer', 'dessert', 'hotpot', 'main_course', 'beverage', 'signature_dishes', 'snack') NOT NULL, \`ingredients\` varchar(255) NOT NULL, \`rating_count\` int NOT NULL DEFAULT '0', \`average_rating\` float NOT NULL DEFAULT '0', \`stock\` int NOT NULL, \`image\` varchar(255) NOT NULL, \`is_available\` tinyint NOT NULL DEFAULT 1, \`is_featured\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_22cc43e9a74d7498546e9a63e7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cart\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`note\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, UNIQUE INDEX \`REL_dccd1ec2d6f5644a69adf163bc\` (\`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`views\` int NOT NULL DEFAULT '1', \`image\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_240853a0c3353c25fb12434ad3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket_message\` (\`id\` varchar(36) NOT NULL, \`message\` varchar(255) NOT NULL, \`sender_type\` enum ('user', 'admin') NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`support_ticket_id\` varchar(36) NULL, \`sender_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`support_ticket\` (\`id\` varchar(36) NOT NULL, \`original_request\` varchar(255) NOT NULL, \`status\` enum ('pending', 'success', 'error') NOT NULL DEFAULT 'pending', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NULL, \`password\` varchar(255) NULL, \`google_id\` varchar(255) NULL, \`facebook_id\` varchar(255) NULL, \`name\` varchar(255) NULL, \`job\` varchar(255) NULL, \`email\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, \`theme\` enum ('dark', 'light') NOT NULL DEFAULT 'dark', \`total_orders\` int NOT NULL DEFAULT '0', \`total_reservations\` int NOT NULL DEFAULT '0', \`loyalty_points\` int NOT NULL DEFAULT '0', \`image\` varchar(255) NOT NULL DEFAULT 'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735465375/default_user_logo_b1f7pd.png', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_7adac5c0b28492eb292d4a9387\` (\`google_id\`), UNIQUE INDEX \`IDX_189473aaba06ffd667bb024e71\` (\`facebook_id\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`email\` (\`id\` varchar(36) NOT NULL, \`recipient\` varchar(255) NOT NULL, \`type\` enum ('verify', 'notify', 'forget-password') NOT NULL, \`status\` enum ('pending', 'sent', 'failed') NOT NULL DEFAULT 'sent', \`content_url\` varchar(255) NOT NULL, \`sent_at\` timestamp NOT NULL, \`verification_code\` varchar(255) NULL, \`verification_link\` varchar(255) NULL, \`expired_at\` timestamp NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`event\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`guests_number\` int NOT NULL, \`image\` varchar(255) NOT NULL, \`type\` enum ('concert', 'food_festival', 'cooking_class', 'holiday_event') NOT NULL, \`status\` enum ('scheduled', 'ongoing', 'finished') NOT NULL DEFAULT 'scheduled', \`note\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`review_order\` (\`review_id\` varchar(36) NOT NULL, \`order_id\` varchar(255) NOT NULL, INDEX \`IDX_e17ce5a93f2a540b4b13dcf75f\` (\`review_id\`), INDEX \`IDX_2265152c45c0a10ba900bb05e1\` (\`order_id\`), PRIMARY KEY (\`review_id\`, \`order_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`review_reservation\` (\`review_id\` varchar(36) NOT NULL, \`reservation_id\` varchar(255) NOT NULL, INDEX \`IDX_0a1efddfae33e83d78be8af756\` (\`review_id\`), INDEX \`IDX_bbc2bbc00be39e4a040ce09976\` (\`reservation_id\`), PRIMARY KEY (\`review_id\`, \`reservation_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reservation_table\` (\`reservation_id\` varchar(255) NOT NULL, \`table_id\` varchar(36) NOT NULL, INDEX \`IDX_60a89d4a03b474dbd918b317b8\` (\`reservation_id\`), INDEX \`IDX_a8c8e6608e72192eb726d84dd3\` (\`table_id\`), PRIMARY KEY (\`reservation_id\`, \`table_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_discount\` (\`discount_id\` varchar(36) NOT NULL, \`order_id\` varchar(255) NOT NULL, INDEX \`IDX_866b135249451c9981c2f58517\` (\`discount_id\`), INDEX \`IDX_acb8e88df0e9b1287d39c3d2d7\` (\`order_id\`), PRIMARY KEY (\`discount_id\`, \`order_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reservation_discount\` (\`discount_id\` varchar(36) NOT NULL, \`reservation_id\` varchar(255) NOT NULL, INDEX \`IDX_1dc04cfdbcd5feb69cb3f16505\` (\`discount_id\`), INDEX \`IDX_8b1468aafb5b0dfe11aa58e813\` (\`reservation_id\`), PRIMARY KEY (\`discount_id\`, \`reservation_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permission\` (\`permission_id\` varchar(36) NOT NULL, \`role_id\` varchar(36) NOT NULL, INDEX \`IDX_e3a3ba47b7ca00fd23be4ebd6c\` (\`permission_id\`), INDEX \`IDX_3d0a7155eafd75ddba5a701336\` (\`role_id\`), PRIMARY KEY (\`permission_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`user_id\` varchar(36) NOT NULL, \`role_id\` varchar(36) NOT NULL, INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` (\`user_id\`), INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion\` ADD CONSTRAINT \`FK_0fbf4831e38d71712613078809a\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discount\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_c66c60a17b56ec882fcd8ec770b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_81446f2ee100305f42645d4d6c2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_26b533e15b5f2334c96339a1f08\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` ADD CONSTRAINT \`FK_65407279bef3b9e1458bb4ac588\` FOREIGN KEY (\`area_id\`) REFERENCES \`area\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_5c2dde2fd3e7b093822c5ad3ff1\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_e219b0a4ff01b85072bfadf3fd7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_discount\` ADD CONSTRAINT \`FK_9ba59652f7dca93ed0e2bf06956\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_discount\` ADD CONSTRAINT \`FK_ed10f57b4e0950367993ef93516\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discount\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_28c756d4fd41223fedfbd2750e1\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_199e32a02ddc0f47cd93181d8fd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD CONSTRAINT \`FK_ea143999ecfa6a152f2202895e2\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` ADD CONSTRAINT \`FK_400f1584bf37c21172da3b15e2d\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_dccd1ec2d6f5644a69adf163bc1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_354c58d3c73d8e063e7c46b18de\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` ADD CONSTRAINT \`FK_36a370fcfdb4015326b72f92f65\` FOREIGN KEY (\`support_ticket_id\`) REFERENCES \`support_ticket\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` ADD CONSTRAINT \`FK_3eeba4ad434505c799742d233fb\` FOREIGN KEY (\`sender_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` ADD CONSTRAINT \`FK_cb2e00c16c925e889f6e2dc2a4b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_order\` ADD CONSTRAINT \`FK_e17ce5a93f2a540b4b13dcf75f8\` FOREIGN KEY (\`review_id\`) REFERENCES \`review\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_order\` ADD CONSTRAINT \`FK_2265152c45c0a10ba900bb05e19\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_reservation\` ADD CONSTRAINT \`FK_0a1efddfae33e83d78be8af756d\` FOREIGN KEY (\`review_id\`) REFERENCES \`review\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_reservation\` ADD CONSTRAINT \`FK_bbc2bbc00be39e4a040ce099762\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`reservation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` ADD CONSTRAINT \`FK_60a89d4a03b474dbd918b317b8b\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`reservation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` ADD CONSTRAINT \`FK_a8c8e6608e72192eb726d84dd30\` FOREIGN KEY (\`table_id\`) REFERENCES \`table\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_discount\` ADD CONSTRAINT \`FK_866b135249451c9981c2f585178\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discount\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_discount\` ADD CONSTRAINT \`FK_acb8e88df0e9b1287d39c3d2d7c\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_discount\` ADD CONSTRAINT \`FK_1dc04cfdbcd5feb69cb3f165051\` FOREIGN KEY (\`discount_id\`) REFERENCES \`discount\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_discount\` ADD CONSTRAINT \`FK_8b1468aafb5b0dfe11aa58e8133\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`reservation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3a3ba47b7ca00fd23be4ebd6cf\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_3d0a7155eafd75ddba5a7013368\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_32a6fc2fcb019d8e3a8ace0f55f\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_32a6fc2fcb019d8e3a8ace0f55f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_3d0a7155eafd75ddba5a7013368\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3a3ba47b7ca00fd23be4ebd6cf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_discount\` DROP FOREIGN KEY \`FK_8b1468aafb5b0dfe11aa58e8133\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_discount\` DROP FOREIGN KEY \`FK_1dc04cfdbcd5feb69cb3f165051\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_discount\` DROP FOREIGN KEY \`FK_acb8e88df0e9b1287d39c3d2d7c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_discount\` DROP FOREIGN KEY \`FK_866b135249451c9981c2f585178\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` DROP FOREIGN KEY \`FK_a8c8e6608e72192eb726d84dd30\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation_table\` DROP FOREIGN KEY \`FK_60a89d4a03b474dbd918b317b8b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_reservation\` DROP FOREIGN KEY \`FK_bbc2bbc00be39e4a040ce099762\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_reservation\` DROP FOREIGN KEY \`FK_0a1efddfae33e83d78be8af756d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_order\` DROP FOREIGN KEY \`FK_2265152c45c0a10ba900bb05e19\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review_order\` DROP FOREIGN KEY \`FK_e17ce5a93f2a540b4b13dcf75f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`support_ticket\` DROP FOREIGN KEY \`FK_cb2e00c16c925e889f6e2dc2a4b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` DROP FOREIGN KEY \`FK_3eeba4ad434505c799742d233fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket_message\` DROP FOREIGN KEY \`FK_36a370fcfdb4015326b72f92f65\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_354c58d3c73d8e063e7c46b18de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_dccd1ec2d6f5644a69adf163bc1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` DROP FOREIGN KEY \`FK_400f1584bf37c21172da3b15e2d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_product\` DROP FOREIGN KEY \`FK_ea143999ecfa6a152f2202895e2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_199e32a02ddc0f47cd93181d8fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_28c756d4fd41223fedfbd2750e1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_discount\` DROP FOREIGN KEY \`FK_ed10f57b4e0950367993ef93516\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_discount\` DROP FOREIGN KEY \`FK_9ba59652f7dca93ed0e2bf06956\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_e219b0a4ff01b85072bfadf3fd7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_5c2dde2fd3e7b093822c5ad3ff1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`table\` DROP FOREIGN KEY \`FK_65407279bef3b9e1458bb4ac588\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_26b533e15b5f2334c96339a1f08\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_81446f2ee100305f42645d4d6c2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_c66c60a17b56ec882fcd8ec770b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`promotion\` DROP FOREIGN KEY \`FK_0fbf4831e38d71712613078809a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_32a6fc2fcb019d8e3a8ace0f55\` ON \`user_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``,
    );
    await queryRunner.query(`DROP TABLE \`user_role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3d0a7155eafd75ddba5a701336\` ON \`role_permission\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e3a3ba47b7ca00fd23be4ebd6c\` ON \`role_permission\``,
    );
    await queryRunner.query(`DROP TABLE \`role_permission\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8b1468aafb5b0dfe11aa58e813\` ON \`reservation_discount\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1dc04cfdbcd5feb69cb3f16505\` ON \`reservation_discount\``,
    );
    await queryRunner.query(`DROP TABLE \`reservation_discount\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_acb8e88df0e9b1287d39c3d2d7\` ON \`order_discount\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_866b135249451c9981c2f58517\` ON \`order_discount\``,
    );
    await queryRunner.query(`DROP TABLE \`order_discount\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a8c8e6608e72192eb726d84dd3\` ON \`reservation_table\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_60a89d4a03b474dbd918b317b8\` ON \`reservation_table\``,
    );
    await queryRunner.query(`DROP TABLE \`reservation_table\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bbc2bbc00be39e4a040ce09976\` ON \`review_reservation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0a1efddfae33e83d78be8af756\` ON \`review_reservation\``,
    );
    await queryRunner.query(`DROP TABLE \`review_reservation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2265152c45c0a10ba900bb05e1\` ON \`review_order\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e17ce5a93f2a540b4b13dcf75f\` ON \`review_order\``,
    );
    await queryRunner.query(`DROP TABLE \`review_order\``);
    await queryRunner.query(`DROP TABLE \`event\``);
    await queryRunner.query(`DROP TABLE \`email\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_189473aaba06ffd667bb024e71\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7adac5c0b28492eb292d4a9387\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`support_ticket\``);
    await queryRunner.query(`DROP TABLE \`ticket_message\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``,
    );
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_240853a0c3353c25fb12434ad3\` ON \`permission\``,
    );
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(`DROP TABLE \`notification\``);
    await queryRunner.query(
      `DROP INDEX \`REL_dccd1ec2d6f5644a69adf163bc\` ON \`cart\``,
    );
    await queryRunner.query(`DROP TABLE \`cart\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_22cc43e9a74d7498546e9a63e7\` ON \`product\``,
    );
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(`DROP TABLE \`order_product\``);
    await queryRunner.query(
      `DROP INDEX \`REL_28c756d4fd41223fedfbd2750e\` ON \`order\``,
    );
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`discount\``);
    await queryRunner.query(`DROP TABLE \`user_discount\``);
    await queryRunner.query(
      `DROP INDEX \`REL_5c2dde2fd3e7b093822c5ad3ff\` ON \`reservation\``,
    );
    await queryRunner.query(`DROP TABLE \`reservation\``);
    await queryRunner.query(`DROP TABLE \`table\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_644ffaf8fbde4db798cb47712f\` ON \`area\``,
    );
    await queryRunner.query(`DROP TABLE \`area\``);
    await queryRunner.query(`DROP TABLE \`review\``);
    await queryRunner.query(`DROP TABLE \`payment\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_969359329a22440d2b8f7d491d\` ON \`promotion\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_51ac9c3fe5a2ca61b9475fce02\` ON \`promotion\``,
    );
    await queryRunner.query(`DROP TABLE \`promotion\``);
  }
}
