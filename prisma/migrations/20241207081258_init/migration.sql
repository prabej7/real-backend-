/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Hostels` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Hostels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hostels" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hostels_name_key" ON "Hostels"("name");
