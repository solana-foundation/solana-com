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

/** RPC API — single document/page icon */
export function ApiIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.167 1.667h7.5L16.667 6.667v11.666H4.167V1.667Zm1.666 1.666v13.334h9.167V7.5H11.667V3.333H5.833Zm7.5 2.5L11.667 4.167V5.833h1.666Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

/** EVM to SVM — monitor/computer icon */
export function ComputerIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.667 2.5H18.333V13.333H11.25v2.5h2.917v1.667H5.833v-1.667H8.75v-2.5H1.667V2.5Zm1.666 1.667v7.5h13.334v-7.5H3.333Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Hackathons & Events — 4-point star/diamond sparkle */
export function DiamondIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 1C10 6.1 6.1 10 1 10c5.1 0 9 3.9 9 9 0-5.1 3.9-9 9-9-5.1 0-9-3.9-9-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Stablecoins — dollar coin icon from nav/solutions/coin */
export function CoinIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 1.667C14.603 1.667 18.333 5.398 18.333 10S14.603 18.333 10 18.333 1.667 14.603 1.667 10 5.398 1.667 10 1.667ZM9.167 5v.931a3.1 3.1 0 0 0-1.209.492c-.521.383-.874.974-.874 1.725 0 .908.422 1.534 1.011 1.94.52.36 1.177.552 1.666.699.557.167.942.292 1.207.47.192.133.3.268.3.556 0 .163-.062.275-.191.37-.156.115-.423.21-.775.222-.747.028-1.4-.31-1.618-.744l-1.49.745c.441.883 1.32 1.362 2.209 1.548V15h1.666v-.98c.415-.083.82-.237 1.167-.49.535-.38.917-.976.917-1.748 0-.904-.431-1.52-1.019-1.916-.52-.349-1.176-.537-1.66-.682-.557-.167-.942-.292-1.208-.47-.193-.133-.3-.268-.3-.555 0-.164.062-.275.19-.37.156-.115.423-.21.775-.223.748-.028 1.4.31 1.618.745l1.491-.745c-.412-.824-1.19-1.308-1.996-1.53V5H9.167Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Tokenization — coins-add icon from nav/solutions */
export function TokenizeIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5.001 11.667c0-3.849 2.9-7.02 6.633-7.45A5.83 5.83 0 0 0 7.5 2.5a5.833 5.833 0 0 0-2.211 11.233 8.3 8.3 0 0 1-.288-2.066Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.5 17.5a5.833 5.833 0 1 0 0-11.667 5.833 5.833 0 0 0 0 11.667Zm.834-8.333h-1.667v1.666h-1.666V12.5h1.666v1.667h1.667V12.5h1.666v-1.667h-1.666V9.167Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Institutional Payments — bank/columns icon from nav/solutions */
export function BankIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.001 1.383 1.668 5.593v2.74h1.666V13.75h-.659l-1.25 3.75h17.15l-1.25-3.75h-.659V8.333h1.667V5.593L10.001 1.383Zm3.334 6.95h2.083V13.75h-2.083V8.333Zm-6.667 5.417H4.585V8.333h2.083v5.417Zm1.25 0V8.333h4.167v5.417H7.918Z"
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
        d="M19.165 16.667V15h-1.666V5.833H13.332V15h-.833V2.5H2.499V15H.832v1.667h18.333ZM9.165 6.667H5.832v1.666h3.333V6.667Zm0 3.333H5.832v1.667h3.333V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Financial Infrastructure — castle/fortress gate icon */
export function InfraIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M.477.235A.65.65 0 0 0 .152.4C0 .54 0 .59 0 10.17c0 9.465 0 9.625.144 9.68.204.07 19.508.07 19.713 0 .144-.055.144-.215.144-9.655 0-9.02-.008-9.615-.13-9.75-.204-.23-.461-.255-2.613-.235-2.462.02-2.28-.055-2.318.94l-.03.7-1.19-.01-1.182-.015-.038-.685c-.053-.99.152-.915-2.492-.915H7.894l-.197.12c-.19.115-.197.145-.212.8l-.023.68-1.166.015c-.887.01-1.182-.005-1.235-.05-.03-.035-.06-.36-.06-.72C5 .155 5.19.225 2.658.22 1.553.215.57.22.477.235m16.91 10.64v7.35l-1.735.015c-1.212.01-1.765-.005-1.833-.045-.091-.045-.106-.45-.106-2.24 0-1.98-.016-2.21-.144-2.53q-.478-1.163-1.978-1.635c-1.84-.58-4.06-.065-4.886 1.135-.41.59-.417.62-.417 3 0 1.815-.015 2.225-.106 2.27-.068.04-.621.055-1.833.045l-1.735-.015-.023-7.3c-.008-4.015 0-7.33.023-7.365.022-.05 1.545-.06 7.401-.05l7.372.015z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Real World Assets — storefront/mall icon from nav/solutions */
export function RwaIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.668 3.333h16.666v13.334H1.668V3.333Zm11.667 12.084V9.167h-2.709v6.25h2.709Zm-3.959 0V9.167H6.668v6.25h2.708Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
