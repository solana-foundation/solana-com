CREATE TABLE "here_for_people" (
    "id" UUID NOT NULL,
    "handle" VARCHAR(16) NOT NULL,
    "xUserId" VARCHAR(32),
    "claimedById" UUID,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "claimedAt" TIMESTAMPTZ(6),
    "ipHash" VARCHAR(43),
    "country" VARCHAR(2),
    CONSTRAINT "here_for_people_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "here_for_adds" (
    "id" UUID NOT NULL,
    "fromId" UUID NOT NULL,
    "toId" UUID NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "here_for_adds_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "here_for_adds_rank_check" CHECK ("rank" BETWEEN 1 AND 3),
    CONSTRAINT "here_for_adds_no_self" CHECK ("fromId" <> "toId")
);
CREATE TABLE "here_for_layout_snapshots" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nodeCount" INTEGER NOT NULL,
    "linkCount" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    CONSTRAINT "here_for_layout_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "here_for_people_handle_key" ON "here_for_people"("handle");
CREATE UNIQUE INDEX "here_for_people_claimedById_key" ON "here_for_people"("claimedById");
CREATE UNIQUE INDEX "here_for_adds_fromId_rank_key" ON "here_for_adds"("fromId","rank");
CREATE UNIQUE INDEX "here_for_adds_fromId_toId_key" ON "here_for_adds"("fromId","toId");
CREATE INDEX "here_for_adds_toId_idx" ON "here_for_adds"("toId");
ALTER TABLE "here_for_people" ADD CONSTRAINT "here_for_people_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "awards_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "here_for_adds" ADD CONSTRAINT "here_for_adds_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "here_for_people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "here_for_adds" ADD CONSTRAINT "here_for_adds_toId_fkey" FOREIGN KEY ("toId") REFERENCES "here_for_people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "here_for_x_sessions" (
    "id" UUID NOT NULL,
    "xUserId" VARCHAR(32) NOT NULL,
    "handle" VARCHAR(16) NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "here_for_x_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "here_for_x_sessions_expiresAt_idx" ON "here_for_x_sessions"("expiresAt");
