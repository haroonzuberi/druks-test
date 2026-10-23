-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `averageRating` FLOAT NULL,
    ADD COLUMN `reviewCount` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `Restaurant_city_idx` ON `Restaurant`(`city`);

-- CreateIndex
CREATE INDEX `Restaurant_averageRating_idx` ON `Restaurant`(`averageRating`);
