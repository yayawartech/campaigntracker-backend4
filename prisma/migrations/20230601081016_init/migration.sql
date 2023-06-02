-- CreateTable
CREATE TABLE `DmReportingHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `advertiser` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `manager` VARCHAR(191) NOT NULL,
    `buyer` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hour` INTEGER NOT NULL,
    `campaign` VARCHAR(191) NOT NULL,
    `adset` VARCHAR(191) NOT NULL,
    `adsetid` INTEGER NOT NULL,
    `revenue` INTEGER NOT NULL,
    `spend` INTEGER NOT NULL,
    `link_clicks` INTEGER NOT NULL,
    `ad_clicks` INTEGER NOT NULL,
    `gp` INTEGER NOT NULL,
    `searches` INTEGER NOT NULL,
    `clicks` INTEGER NOT NULL,
    `tq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DmReporting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `advertiser` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `manager` VARCHAR(191) NOT NULL,
    `buyer` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hour` INTEGER NOT NULL,
    `campaign` VARCHAR(191) NOT NULL,
    `adset` VARCHAR(191) NOT NULL,
    `adsetid` INTEGER NOT NULL,
    `revenue` INTEGER NOT NULL,
    `spend` INTEGER NOT NULL,
    `link_clicks` INTEGER NOT NULL,
    `ad_clicks` INTEGER NOT NULL,
    `gp` INTEGER NOT NULL,
    `searches` INTEGER NOT NULL,
    `clicks` INTEGER NOT NULL,
    `tq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
