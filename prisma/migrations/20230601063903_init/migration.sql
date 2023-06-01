-- CreateTable
CREATE TABLE `AdSets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `facebook_id` VARCHAR(191) NOT NULL,
    `adaccount_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `daily_budget` VARCHAR(191) NOT NULL,
    `created_time` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
