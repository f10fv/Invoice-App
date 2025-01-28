-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectNumber" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);
