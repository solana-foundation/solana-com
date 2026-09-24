export const GENERAL_ADMISSION_PRICE_CHANGE = {
  current: {
    amount: 450,
    display: "$450",
  },
  increased: {
    amount: 550,
    display: "$550",
  },
  increasesAt: "2026-08-01T09:00:00Z",
} as const;

export const GENERAL_ADMISSION_PRICE_INCREASE_AT = Date.parse(
  GENERAL_ADMISSION_PRICE_CHANGE.increasesAt,
);

export type TicketPriceCountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function hasGeneralAdmissionPriceIncreased(now: number): boolean {
  return now >= GENERAL_ADMISSION_PRICE_INCREASE_AT;
}

export function getTicketPriceCountdownParts(
  now: number,
): TicketPriceCountdownParts {
  const remainingSeconds = Math.ceil(
    Math.max(0, GENERAL_ADMISSION_PRICE_INCREASE_AT - now) / 1000,
  );

  return {
    days: Math.floor(remainingSeconds / 86400),
    hours: Math.floor((remainingSeconds % 86400) / 3600),
    minutes: Math.floor((remainingSeconds % 3600) / 60),
    seconds: remainingSeconds % 60,
  };
}
