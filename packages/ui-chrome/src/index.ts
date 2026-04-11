import YoutubeIcon from "./assets/youtube.inline.svg";
import TwitterIcon from "./assets/twitter.inline.svg";
import DiscordIcon from "./assets/discord.inline.svg";
import RedditIcon from "./assets/reddit.inline.svg";
import GithubIcon from "./assets/github.inline.svg";
import TelegramIcon from "./assets/telegram.inline.svg";

export {
  YoutubeIcon,
  TwitterIcon,
  DiscordIcon,
  RedditIcon,
  GithubIcon,
  TelegramIcon,
};

export { Footer } from "./footer";
export { Header } from "./header";
export { ThemeProvider } from "./theme-provider";
export { InkeepChatButton } from "./inkeep-chat-button";
export { InkeepSearchBar } from "./inkeep-searchbar";
export { NewsletterModal } from "./newsletter-modal";
export { CookieConsentBanner } from "./cookie-consent-banner";
export {
  applyCookieConsent,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_TTL_MS,
  persistCookieConsent,
  readCookieConsent,
} from "./cookie-consent";
export { useCookieConsent } from "./use-cookie-consent";
export { PersistentPodcastPlayer } from "./persistent-podcast-player";
export {
  DEFAULT_PODCAST_PLAYER_STATE,
  dispatchPodcastPlayerCommand,
  readPodcastPlayerState,
  subscribeToPodcastPlayerState,
} from "./podcast-player-store";
export { SitewideTopAlert } from "./sitewide-top-alert";
export { sitewideTopAlertConfig } from "./sitewide-top-alert-config";
export type { SitewideTopAlertConfig } from "./sitewide-top-alert-config";
export type {
  PodcastPlayerCommand,
  PodcastPlayerEpisode,
  PodcastPlayerState,
} from "./podcast-player-types";
export {
  DOCS_SIDEBAR_TOGGLE_SLOT_ID,
  DocsSidebarToggleIcon,
} from "./docs-sidebar-toggle";
export { LanguageSelector } from "./language-selector";
export * from "./sheet";
