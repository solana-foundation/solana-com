ALTER TABLE "awards_nominations"
  ADD COLUMN "secondTwitterHandle" VARCHAR(16);

ALTER TABLE "awards_nomination_attempts"
  ADD COLUMN "secondTwitterHandle" VARCHAR(16);
