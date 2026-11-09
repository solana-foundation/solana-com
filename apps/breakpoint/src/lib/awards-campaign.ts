export type AwardsCampaignStatus = "open" | "not_started" | "closed";
export type AwardsVotingStatus = "not_started" | "open" | "closed";

export const defaultVotingWindow = {
  opensAt: "2026-10-13T00:00:00Z",
  closesAt: "2026-11-10T00:00:00Z",
} as const;

export const defaultNominationsWindow = {
  opensAt: null,
  closesAt: defaultVotingWindow.opensAt,
} as const;

function parseDate(value: string | null, name: string) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)) {
    throw new Error(`${name} must be a UTC ISO-8601 date.`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${name} must be an ISO-8601 date.`);
  }
  return date;
}

function nominationsCloseAt() {
  return parseDate(defaultNominationsWindow.closesAt, "nominations close");
}

export function getAwardsVotingStatus(now = new Date()): AwardsVotingStatus {
  const opensAt = parseDate(defaultVotingWindow.opensAt, "voting opens");
  const closesAt = parseDate(defaultVotingWindow.closesAt, "voting closes");
  const nominationsClose = nominationsCloseAt();

  if (!nominationsClose || !opensAt || !closesAt) return "not_started";
  if (opensAt < nominationsClose || closesAt <= opensAt) {
    throw new Error(
      "Voting must open after nominations close and close after it opens.",
    );
  }
  if (now < opensAt) return "not_started";
  if (now >= closesAt) return "closed";
  return "open";
}

export function getAwardsCampaignStatus(
  now = new Date(),
): AwardsCampaignStatus {
  const opensAt = parseDate(
    defaultNominationsWindow.opensAt,
    "nominations open",
  );
  const closesAt = nominationsCloseAt();

  if (opensAt && closesAt && opensAt >= closesAt) {
    throw new Error("Awards nominations must close after they open.");
  }
  if (opensAt && now < opensAt) return "not_started";
  if (closesAt && now >= closesAt) return "closed";
  return "open";
}

export function campaignMessage(status: AwardsCampaignStatus) {
  switch (status) {
    case "not_started":
      return "Nominations have not opened yet. Please check back soon.";
    case "closed":
      return "Nominations are now closed. Thank you for taking part.";
    default:
      return null;
  }
}
