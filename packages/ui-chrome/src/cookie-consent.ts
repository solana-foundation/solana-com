import {
  safeStorageGetItem,
  safeStorageRemoveItem,
  safeStorageSetItem,
} from "./browser-storage";

export const COOKIE_CONSENT_KEY = "cookie_consent";
export const COOKIE_CONSENT_EVENT = "solana:cookie-consent-change";
// ~182.6 days (~6 months); 15778476000 = 6 × 30.436875d in ms
export const COOKIE_CONSENT_TTL_MS = 15778476000;

type CookieConsentStore = {
  value: boolean;
  timeToExpire: number;
};

type ConsentMode = "granted" | "denied";

export type CookieConsentValue = boolean | null;

const normalizeCookieConsentValue = (value: unknown): CookieConsentValue => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === 1 || value === "1" || value === "true") {
    return true;
  }

  if (value === 0 || value === "0" || value === "false") {
    return false;
  }

  return null;
};

export type CookieConsentWindow = {
  builderNoTrack?: boolean;
  dispatchEvent?: (event: Event) => boolean;
  CustomEvent?: typeof CustomEvent;
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

export const getCookieConsentDefaultScript = () => `
window.dataLayer = window.dataLayer || [];
window.gtag =
  window.gtag ||
  function gtag() {
    window.dataLayer.push(arguments);
  };
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
`;

export const readCookieConsent = ({
  key = COOKIE_CONSENT_KEY,
  now = Date.now(),
  storage,
}: {
  key?: string;
  now?: number;
  storage: Pick<Storage, "getItem" | "removeItem"> | null | undefined;
}): CookieConsentValue => {
  if (!storage) {
    return null;
  }

  let sticky: unknown = null;

  try {
    sticky = JSON.parse(safeStorageGetItem(storage, key) || "null");
  } catch (error) {
    console.error(error);
    safeStorageRemoveItem(storage, key);
    return null;
  }

  if (sticky === null) {
    return null;
  }

  const legacyValue = normalizeCookieConsentValue(sticky);
  if (legacyValue !== null) {
    return legacyValue;
  }

  if (typeof sticky !== "object") {
    safeStorageRemoveItem(storage, key);
    return null;
  }

  const stickyStore = sticky as Partial<CookieConsentStore>;

  const consentValue = normalizeCookieConsentValue(stickyStore.value);
  if (
    consentValue === null ||
    typeof stickyStore.timeToExpire !== "number" ||
    Number.isNaN(stickyStore.timeToExpire)
  ) {
    safeStorageRemoveItem(storage, key);
    return null;
  }

  if (now > stickyStore.timeToExpire) {
    safeStorageRemoveItem(storage, key);
    return null;
  }

  return consentValue;
};

export const persistCookieConsent = ({
  key = COOKIE_CONSENT_KEY,
  now = Date.now(),
  storage,
  value,
}: {
  key?: string;
  now?: number;
  storage: Pick<Storage, "setItem"> | null | undefined;
  value: boolean;
}) => {
  const sticky: CookieConsentStore = {
    value,
    timeToExpire: now + COOKIE_CONSENT_TTL_MS,
  };

  safeStorageSetItem(storage, key, JSON.stringify(sticky));
};

export const applyCookieConsent = ({
  value,
  targetWindow,
}: {
  value: boolean;
  targetWindow: CookieConsentWindow;
}) => {
  targetWindow.builderNoTrack = !value;

  if (typeof targetWindow.gtag !== "undefined") {
    targetWindow.gtag("consent", "update", {
      ad_storage: value ? "granted" : "denied",
      ad_user_data: value ? "granted" : "denied",
      ad_personalization: value ? "granted" : "denied",
      analytics_storage: value ? "granted" : "denied",
    });
  }

  dispatchCookieConsentChange({
    targetWindow,
    value,
  });
};

const dispatchCookieConsentChange = ({
  targetWindow,
  value,
}: {
  targetWindow: CookieConsentWindow;
  value: boolean;
}) => {
  if (
    typeof targetWindow.dispatchEvent !== "function" ||
    typeof targetWindow.CustomEvent === "undefined"
  ) {
    return;
  }

  targetWindow.dispatchEvent(
    new targetWindow.CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: { value },
    }),
  );
};

export const getCookieConsentBootstrapScript = ({
  gaMeasurementId,
}: {
  gaMeasurementId?: string;
} = {}) => `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
(function () {
  var consentKey = ${JSON.stringify(COOKIE_CONSENT_KEY)};
  var storage = null;
  var rawConsent = null;
  var parsedConsent = null;

  try {
    storage = window.localStorage;
    rawConsent = storage.getItem(consentKey);
  } catch (_) {}

  function removeConsent() {
    try {
      if (storage) {
        storage.removeItem(consentKey);
      }
    } catch (_) {}
  }

  try {
    parsedConsent = JSON.parse(rawConsent || 'null');
  } catch (_) {
    removeConsent();
  }

  function normalizeConsentValue(value) {
    if (typeof value === 'boolean') {
      return value;
    }

    if (value === 1 || value === '1' || value === 'true') {
      return true;
    }

    if (value === 0 || value === '0' || value === 'false') {
      return false;
    }

    return null;
  }

  function readConsentValue(value) {
    var legacyValue = normalizeConsentValue(value);
    if (legacyValue !== null) {
      return legacyValue;
    }

    if (value === null) {
      return null;
    }

    if (!value || typeof value !== 'object') {
      removeConsent();
      return null;
    }

    var normalizedValue = normalizeConsentValue(value.value);
    if (
      normalizedValue === null ||
      typeof value.timeToExpire !== 'number' ||
      Number.isNaN(value.timeToExpire)
    ) {
      removeConsent();
      return null;
    }

    if (Date.now() > value.timeToExpire) {
      removeConsent();
      return null;
    }

    return normalizedValue;
  }

  var consentValue = readConsentValue(parsedConsent);

  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  if (consentValue !== null) {
    window.builderNoTrack = !consentValue;
    window.gtag('consent', 'update', {
      ad_storage: consentValue ? 'granted' : 'denied',
      ad_user_data: consentValue ? 'granted' : 'denied',
      ad_personalization: consentValue ? 'granted' : 'denied',
      analytics_storage: consentValue ? 'granted' : 'denied'
    });
  } else {
    window.builderNoTrack = true;
  }

  ${
    gaMeasurementId
      ? `window.gtag('config', ${JSON.stringify(gaMeasurementId)});`
      : ""
  }
})();`;
