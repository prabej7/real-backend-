/*
  Warnings:

  - The `parking` column on the `Lands` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Lands" DROP COLUMN "parking",
ADD COLUMN     "parking" BOOLEAN;
