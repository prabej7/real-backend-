-- CreateTable
CREATE TABLE "DeleteReq" (
    "id" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    "roomId" TEXT,
    "hostelId" TEXT,
    "landId" TEXT,

    CONSTRAINT "DeleteReq_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeleteReq" ADD CONSTRAINT "DeleteReq_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeleteReq" ADD CONSTRAINT "DeleteReq_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeleteReq" ADD CONSTRAINT "DeleteReq_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeleteReq" ADD CONSTRAINT "DeleteReq_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Lands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
