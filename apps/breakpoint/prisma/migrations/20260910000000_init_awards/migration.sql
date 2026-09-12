CREATE TABLE "awards_users" (
    "id" UUID NOT NULL,
    "browserUuid" VARCHAR(255) NOT NULL,
    "country" VARCHAR(2),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "awards_users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "awards_nominations" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "twitterHandle" VARCHAR(15) NOT NULL,
    "submittedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" VARCHAR(2),
    CONSTRAINT "awards_nominations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "awards_users_browserUuid_key" ON "awards_users"("browserUuid");
CREATE INDEX "awards_users_country_idx" ON "awards_users"("country");
CREATE UNIQUE INDEX "awards_nominations_userId_category_key" ON "awards_nominations"("userId", "category");
CREATE INDEX "awards_nominations_category_idx" ON "awards_nominations"("category");
CREATE INDEX "awards_nominations_submittedAt_idx" ON "awards_nominations"("submittedAt");
CREATE INDEX "awards_nominations_country_idx" ON "awards_nominations"("country");
ALTER TABLE "awards_nominations" ADD CONSTRAINT "awards_nominations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "awards_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
