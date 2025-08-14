-- CreateTable
CREATE TABLE `AccessLog` (
    `id` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NULL,
    `method` VARCHAR(191) NOT NULL DEFAULT 'GET',
    `path` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `referrer` VARCHAR(191) NULL,
    `articleId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AccessLog_ip_idx`(`ip`),
    INDEX `AccessLog_path_idx`(`path`),
    INDEX `AccessLog_action_idx`(`action`),
    INDEX `AccessLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AccessLog` ADD CONSTRAINT `AccessLog_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessLog` ADD CONSTRAINT `AccessLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
