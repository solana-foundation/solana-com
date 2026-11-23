ALTER TABLE "awards_nominations"
  ALTER COLUMN "twitterHandle" TYPE VARCHAR(16);

ALTER TABLE "awards_nomination_attempts"
  ALTER COLUMN "twitterHandle" TYPE VARCHAR(16);
