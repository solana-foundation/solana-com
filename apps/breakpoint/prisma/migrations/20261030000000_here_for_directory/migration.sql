-- CreateTable
CREATE TABLE "here_for_directory" (
    "handle" VARCHAR(16) NOT NULL,
    "xUserId" VARCHAR(32),
    "name" VARCHAR(64) NOT NULL,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "here_for_directory_pkey" PRIMARY KEY ("handle")
);

-- CreateIndex
CREATE UNIQUE INDEX "here_for_directory_xUserId_key" ON "here_for_directory"("xUserId");
