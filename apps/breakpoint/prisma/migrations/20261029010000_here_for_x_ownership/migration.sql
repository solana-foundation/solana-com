ALTER TABLE "here_for_people" ADD COLUMN "xUserId" VARCHAR(32);

-- Existing sessions have not proved ownership against the new profile binding.
-- Require a fresh OAuth callback before allowing them to submit again.
DELETE FROM "here_for_x_sessions";
