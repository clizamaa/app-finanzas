/*
  Warnings:

  - Added the required column `authorId` to the `Article` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `permissions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO `Role` (`id`, `name`, `description`, `permissions`) VALUES 
('admin_role_id', 'admin', 'Administrador con todos los permisos', '{"articles": {"create": true, "read": true, "update": true, "delete": true, "publish": true}, "users": {"create": true, "read": true, "update": true, "delete": true}, "comments": {"moderate": true}}'),
('editor_role_id', 'editor', 'Redactor que puede crear y editar artículos pero no publicar', '{"articles": {"create": true, "read": true, "update": true, "delete": false, "publish": false}, "users": {"create": false, "read": false, "update": false, "delete": false}, "comments": {"moderate": false}}');

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
INSERT INTO `User` (`id`, `email`, `name`, `password`, `roleId`) VALUES 
('admin_user_id', 'admin@appfinanzas.com', 'Administrador', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin_role_id');

-- Insert default editor user (password: editor123)
INSERT INTO `User` (`id`, `email`, `name`, `password`, `roleId`) VALUES 
('editor_user_id', 'editor@appfinanzas.com', 'Redactor', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'editor_role_id');

-- AlterTable - Add status column first
ALTER TABLE `Article` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'draft';

-- AlterTable - Add authorId column with default value pointing to admin user
ALTER TABLE `Article` ADD COLUMN `authorId` VARCHAR(191) NOT NULL DEFAULT 'admin_user_id';

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Remove default value from authorId column after setting existing records
ALTER TABLE `Article` ALTER COLUMN `authorId` DROP DEFAULT;
