-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastRun" TIMESTAMP(3) NOT NULL,
    "nextRun" TIMESTAMP(3) NOT NULL,
    "interval" TEXT NOT NULL,
    "options" JSONB,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
