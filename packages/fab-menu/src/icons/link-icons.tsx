/** @jsxImportSource preact */
import type { JSX } from "preact";

type IconProps = JSX.SVGAttributes<SVGSVGElement>;

/** Documentation — newspaper/book icon from nav/build */
export function DocsIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 4V20H9C9.867 20 10.4085 20.2352 10.7304 20.5445C11.0491 20.8507 11.25 21.323 11.25 22V7.75C11.25 5.67893 9.57107 4 7.5 4H1Z"
        fill="currentColor"
      />
      <path
        d="M12.75 7.75V22C12.75 21.323 12.9509 20.8507 13.2696 20.5445C13.5915 20.2352 14.133 20 15 20H23V4H16.5C14.4289 4 12.75 5.67893 12.75 7.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** RPC API — uses docs icon variant for compactness */
export const ApiIcon = DocsIcon;

/** Templates — grid icon from nav/build */
export function TemplatesIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 3H10V10H3V3ZM14 3H21V10H14V3ZM3 14H10V21H3V14ZM14 14H21V21H14V14Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Developer Hub — school icon from nav/build */
export function SchoolIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 4H18V18.5H19V8H22V18.5H23V20H1V18.5H2V8H5V18.5H6V4ZM14 18.5V15H10V18.5H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** EVM to SVM — reuses templates icon */
export const EvmIcon = TemplatesIcon;

/** Calendar — from nav/community */
export function CalendarIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.5 2.5H17.5V17.5H2.5V2.5ZM16.25 6.66667H3.75V16.25H16.25V6.66667ZM7.91667 11.4583C7.91667 10.3077 8.84941 9.375 10 9.375C11.1506 9.375 12.0833 10.3077 12.0833 11.4583C12.0833 12.6089 11.1506 13.5417 10 13.5417C8.84941 13.5417 7.91667 12.6089 7.91667 11.4583Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Stablecoins / Stake — simple circle coin */
export function CoinIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15ZM9.167 6.667h1.666v.833h.834a1.667 1.667 0 010 3.333H10V12.5h1.667a1.667 1.667 0 010 3.333h-.834v.834H9.167v-.834h-.834a1.667 1.667 0 010-3.333H10v-1.667H8.333a1.667 1.667 0 010-3.333h.834v-.833Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Tokenization — reuses coin icon */
export const TokenizeIcon = CoinIcon;

/** Bank — institutional payments icon from nav/solutions */
export function BankIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.0013 1.38306L1.66792 5.59304V8.33329H3.33459V13.75H2.67578L1.42578 17.5H18.5767L17.3267 13.75H16.6679V8.33329H18.3346V5.59304L10.0013 1.38306ZM13.3346 8.33329H15.4179V13.75H13.3346V8.33329ZM6.66792 13.75H4.58459V8.33329H6.66792V13.75ZM7.91792 13.75V8.33329H12.0846V13.75H7.91792Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Enterprise — buildings icon from nav/solutions */
export function EnterpriseIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19.1654 16.6667V15H17.4987V5.83333H13.332V15H12.4987V2.5H2.4987V15H0.832031V16.6667H19.1654ZM9.16536 6.66667H5.83203V8.33333H9.16536V6.66667ZM9.16536 10H5.83203V11.6667H9.16536V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Financial Infrastructure — uses bank icon variant */
export const InfraIcon = BankIcon;

/** Real World Assets — reuses enterprise icon */
export const RwaIcon = EnterpriseIcon;

/** Wallet — from nav/learn */
export function WalletIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 6.5C2 5.12055 3.11658 4 4.49855 4H20V7H22V20H5C3.34315 20 2 18.6569 2 17V6.5ZM4 6.5C4 6.77614 4.22386 7 4.5 7H18V6H4.49855C4.22367 6 4 6.2226 4 6.5ZM15 13.5C15 12.6716 15.6716 12 16.5 12C17.3284 12 18 12.6716 18 13.5C18 14.3284 17.3284 15 16.5 15C15.6716 15 15 14.3284 15 13.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Learn — documents icon from nav/learn */
export function LearnIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 5H4V22H18V19H21V8.5H14.5V2H7V5ZM7 6.5V19H16.5V20.5H5.5V6.5H7Z"
        fill="currentColor"
      />
      <path d="M16 2.43934L20.5607 7H16V2.43934Z" fill="currentColor" />
    </svg>
  );
}

/** DeFi — trading-view icon from nav/learn */
export function DefiIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.75 2H6.25V10H3V19H6.25V22H7.75V19H11V10H7.75V2Z"
        fill="currentColor"
      />
      <path
        d="M17.75 2.00001H16.25V5H13V19H16.25V22H17.75V19H21V5H17.75V2.00001Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Community — reexport from tab-consumer (globus icon) */
export { TabConsumerIcon as CommunityIcon } from "./tab-consumer";
