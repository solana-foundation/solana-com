ALTER TABLE "here_for_adds"
  DROP CONSTRAINT "here_for_adds_rank_check",
  ADD CONSTRAINT "here_for_adds_rank_check" CHECK ("rank" BETWEEN 1 AND 10);
