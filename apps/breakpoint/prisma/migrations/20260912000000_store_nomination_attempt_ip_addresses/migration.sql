-- Retain the source IP for every nomination create or update so duplicate
-- submissions can be reviewed against the corresponding audit record.
ALTER TABLE "awards_nomination_attempts"
  ADD COLUMN "ipAddress" VARCHAR(45);
