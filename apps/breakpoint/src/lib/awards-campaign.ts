export type AwardsCampaignStatus = "open" | "not_started" | "closed";

function parseDate(value: string | undefined, name: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${name} must be an ISO-8601 date.`);
  }
  return date;
}

export function getAwardsCampaignStatus(
  now = new Date(),
): AwardsCampaignStatus {
  const opensAt = parseDate(
    process.env.AWARDS_NOMINATIONS_OPENS_AT,
    "AWARDS_NOMINATIONS_OPENS_AT",
  );
  const closesAt = parseDate(
    process.env.AWARDS_NOMINATIONS_CLOSES_AT,
    "AWARDS_NOMINATIONS_CLOSES_AT",
  );

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
