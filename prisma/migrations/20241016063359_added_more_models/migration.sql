/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lon" DOUBLE PRECISION,
ADD COLUMN     "phone" INTEGER,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Rooms" (
    "id" TEXT NOT NULL,
    "noOfRooms" INTEGER NOT NULL,
    "flat" BOOLEAN NOT NULL,
    "waterfacility" BOOLEAN NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "payment" TEXT NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "securityDeposit" INTEGER NOT NULL,
    "noticePeriod" TEXT NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "waterTank" BOOLEAN NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "restrictions" TEXT NOT NULL,
    "img" TEXT[],
    "address" TEXT NOT NULL,
    "lat" INTEGER NOT NULL,
    "lon" INTEGER NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lands" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "parking" TEXT NOT NULL,
    "waterTank" BOOLEAN NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "roadSize" TEXT NOT NULL,
    "img" TEXT[],
    "lat" INTEGER NOT NULL,
    "lon" INTEGER NOT NULL,

    CONSTRAINT "Lands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostels" (
    "id" TEXT NOT NULL,
    "food" BOOLEAN NOT NULL,
    "washroom" BOOLEAN NOT NULL,
    "cctv" BOOLEAN NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "laundry" BOOLEAN NOT NULL,
    "geyser" BOOLEAN NOT NULL,
    "fan" BOOLEAN NOT NULL,
    "studyTable" BOOLEAN NOT NULL,
    "locker" BOOLEAN NOT NULL,
    "cupboard" BOOLEAN NOT NULL,
    "doctorOnCall" BOOLEAN NOT NULL,
    "matress" BOOLEAN NOT NULL,
    "prePayment" BOOLEAN NOT NULL,
    "postPayment" BOOLEAN NOT NULL,
    "img" TEXT[],
    "address" TEXT NOT NULL,
    "lat" INTEGER NOT NULL,
    "lon" INTEGER NOT NULL,

    CONSTRAINT "Hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageBox" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "MessageBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "MessageBox" ADD CONSTRAINT "MessageBox_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageBox" ADD CONSTRAINT "MessageBox_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageBox" ADD CONSTRAINT "MessageBox_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
