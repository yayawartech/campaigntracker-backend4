-- CreateTable
CREATE TABLE `AdAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `timeZone` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
