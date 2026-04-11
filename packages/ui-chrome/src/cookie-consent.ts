export const COOKIE_CONSENT_KEY = "cookie_consent";
// ~182.6 days (~6 months); 15778476000 = 6 × 30.436875d in ms
export const COOKIE_CONSENT_TTL_MS = 15778476000;

type CookieConsentStore = {
  value: boolean;
  timeToExpire: number;
};

type ConsentMode = "granted" | "denied";

export type CookieConsentValue = boolean | null;

export type CookieConsentWindow = {
  builderNoTrack?: boolean;
  gtag?: (
    command: "consent",
    action: "update",
    payload: {
      ad_storage: ConsentMode;
      ad_user_data: ConsentMode;
      ad_personalization: ConsentMode;
      analytics_storage: ConsentMode;
    },
  ) => void;
};

export const readCookieConsent = ({
  key = COOKIE_CONSENT_KEY,
  now = Date.now(),
  storage,
}: {
  key?: string;
  now?: number;
  storage: Pick<Storage, "getItem" | "removeItem">;
}): CookieConsentValue => {
  let sticky: CookieConsentStore | null = null;

  try {
    sticky = JSON.parse(storage.getItem(key) || "null") as CookieConsentStore;
  } catch (error) {
    console.error(error);
    return null;
  }

  if (sticky === null) {
    return null;
  }

  if (now > sticky.timeToExpire) {
    storage.removeItem(key);
    return null;
  }

  return sticky.value;
};

export const persistCookieConsent = ({
  key = COOKIE_CONSENT_KEY,
  now = Date.now(),
  storage,
  value,
}: {
  key?: string;
  now?: number;
  storage: Pick<Storage, "setItem">;
  value: boolean;
}) => {
  const sticky: CookieConsentStore = {
    value,
    timeToExpire: now + COOKIE_CONSENT_TTL_MS,
  };

  storage.setItem(key, JSON.stringify(sticky));
};

export const applyCookieConsent = ({
  value,
  targetWindow,
}: {
  value: boolean;
  targetWindow: CookieConsentWindow;
}) => {
  targetWindow.builderNoTrack = !value;

  if (typeof targetWindow.gtag === "undefined") {
    return;
  }

  targetWindow.gtag("consent", "update", {
    ad_storage: value ? "granted" : "denied",
    ad_user_data: value ? "granted" : "denied",
    ad_personalization: value ? "granted" : "denied",
    analytics_storage: value ? "granted" : "denied",
  });
};
