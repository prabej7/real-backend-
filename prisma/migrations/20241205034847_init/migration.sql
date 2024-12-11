/*
  Warnings:

  - You are about to drop the column `address` on the `Hostels` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Hostels` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Hostels` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `Hostels` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Lands` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Lands` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `Lands` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Rooms` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Rooms` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Rooms` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `Rooms` table. All the data in the column will be lost.
  - Added the required column `infosId` to the `Hostels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infosId` to the `Lands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infosId` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hostels" DROP COLUMN "address",
DROP COLUMN "img",
DROP COLUMN "lat",
DROP COLUMN "lon",
ADD COLUMN     "infosId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lands" DROP COLUMN "img",
DROP COLUMN "lat",
DROP COLUMN "lon",
ADD COLUMN     "infosId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rooms" DROP COLUMN "address",
DROP COLUMN "img",
DROP COLUMN "lat",
DROP COLUMN "lon",
ADD COLUMN     "infosId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Infos" (
    "id" TEXT NOT NULL,
    "lat" INTEGER NOT NULL,
    "lon" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "imgs" TEXT[],
    "price" INTEGER NOT NULL,

    CONSTRAINT "Infos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_infosId_fkey" FOREIGN KEY ("infosId") REFERENCES "Infos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lands" ADD CONSTRAINT "Lands_infosId_fkey" FOREIGN KEY ("infosId") REFERENCES "Infos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostels" ADD CONSTRAINT "Hostels_infosId_fkey" FOREIGN KEY ("infosId") REFERENCES "Infos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
