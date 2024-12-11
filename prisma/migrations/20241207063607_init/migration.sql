/*
  Warnings:

  - Made the column `parking` on table `Lands` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lands" ALTER COLUMN "parking" SET NOT NULL;
