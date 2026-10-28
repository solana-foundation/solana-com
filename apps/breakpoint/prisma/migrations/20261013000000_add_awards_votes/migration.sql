CREATE TABLE "awards_votes" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "twitterHandle" VARCHAR(16) NOT NULL,
    "submittedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" VARCHAR(43),
    "country" VARCHAR(2),
    CONSTRAINT "awards_votes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "awards_votes_userId_category_key" ON "awards_votes"("userId", "category");
CREATE INDEX "awards_votes_category_submittedAt_idx" ON "awards_votes"("category", "submittedAt");
CREATE INDEX "awards_votes_submittedAt_idx" ON "awards_votes"("submittedAt");
ALTER TABLE "awards_votes" ADD CONSTRAINT "awards_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "awards_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
