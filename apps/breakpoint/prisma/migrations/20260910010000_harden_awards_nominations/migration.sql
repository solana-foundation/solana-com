-- Store only a keyed pseudonymous network identifier for new submissions.
ALTER TABLE "awards_users" ADD COLUMN "ipHash" VARCHAR(43);
ALTER TABLE "awards_nominations" ADD COLUMN "ipHash" VARCHAR(43);

CREATE INDEX "awards_users_ipHash_idx" ON "awards_users"("ipHash");
CREATE INDEX "awards_nominations_ipHash_idx" ON "awards_nominations"("ipHash");

CREATE TABLE "awards_nomination_attempts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "twitterHandle" VARCHAR(15) NOT NULL,
    "ipHash" VARCHAR(43),
    "country" VARCHAR(2),
    "action" VARCHAR(20) NOT NULL,
    "submittedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "awards_nomination_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "awards_nomination_attempts_category_twitterHandle_idx"
  ON "awards_nomination_attempts"("category", "twitterHandle");
CREATE INDEX "awards_nomination_attempts_ipHash_idx"
  ON "awards_nomination_attempts"("ipHash");
CREATE INDEX "awards_nomination_attempts_submittedAt_idx"
  ON "awards_nomination_attempts"("submittedAt");

ALTER TABLE "awards_nomination_attempts"
  ADD CONSTRAINT "awards_nomination_attempts_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "awards_users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
