CREATE TABLE "here_for_x_sessions" (
    "id" UUID NOT NULL,
    "xUserId" VARCHAR(32) NOT NULL,
    "handle" VARCHAR(16) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "here_for_x_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "here_for_x_sessions_expiresAt_idx" ON "here_for_x_sessions"("expiresAt");
