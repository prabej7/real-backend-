/*
  Warnings:

  - Added the required column `usersId` to the `Hostels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Lands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `Rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hostels" ADD COLUMN     "usersId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lands" ADD COLUMN     "usersId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "usersId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lands" ADD CONSTRAINT "Lands_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostels" ADD CONSTRAINT "Hostels_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
