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

/** RPC API — concentric circles/connection icon from prototype #ico-api */
export function ApiIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M22.25 12.75H23V11.25H22.25V12V12.75ZM1.75 11.25H1V12.75H1.75V12V11.25ZM12 20.25V19.5C7.85786 19.5 4.5 16.1421 4.5 12H3.75H3C3 16.9706 7.02944 21 12 21V20.25ZM3.75 12H4.5C4.5 7.85786 7.85786 4.5 12 4.5V3.75V3C7.02944 3 3 7.02944 3 12H3.75ZM17.25 12H16.5C16.5 14.4853 14.4853 16.5 12 16.5V17.25V18C15.3137 18 18 15.3137 18 12H17.25ZM12 17.25V16.5C9.51472 16.5 7.5 14.4853 7.5 12H6.75H6C6 15.3137 8.68629 18 12 18V17.25ZM6.75 12H7.5C7.5 9.51472 9.51472 7.5 12 7.5V6.75V6C8.68629 6 6 8.68629 6 12H6.75ZM12 6.75V7.5C14.4853 7.5 16.5 9.51472 16.5 12H17.25H18C18 8.68629 15.3137 6 12 6V6.75ZM12 3.75V4.5C15.3487 4.5 18.1867 6.69523 19.1496 9.72703L19.8644 9.5L20.5792 9.27297C19.4242 5.63638 16.021 3 12 3V3.75ZM19.8644 14.5L19.1496 14.273C18.1867 17.3048 15.3487 19.5 12 19.5V20.25V21C16.021 21 19.4242 18.3636 20.5792 14.727L19.8644 14.5ZM17.25 12V12.75H22.25V12V11.25H17.25V12ZM3.75 12V11.25H1.75V12V12.75H3.75V12Z"
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

/** EVM to SVM — ethereum diamond in circle from prototype #ico-evm */
export function ComputerIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8.6909 11.3647L10.0013 13.1665L11.3117 11.3647L10.0013 11.6923L8.6909 11.3647Z"
        fill="currentColor"
      />
      <path
        d="M10.0013 9.97436L11.9341 9.49115L10.0013 6.83349L8.06846 9.49115L10.0013 9.97436Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.66797 10C1.66797 5.39763 5.39893 1.66667 10.0013 1.66667C14.6037 1.66667 18.3346 5.39763 18.3346 10C18.3346 14.6024 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6024 1.66797 10ZM10.0013 3.99985L5.63755 10L10.0013 16.0002L14.3651 10L10.0013 3.99985Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Hackathons & Events — calendar icon from prototype #ico-cal */
export function DiamondIcon(props: IconProps): JSX.Element {
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

/** Stablecoins — dollar coin icon from prototype #ico-coin */
export function CoinIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.0013 1.66666C14.6037 1.66666 18.3346 5.39762 18.3346 9.99999C18.3346 14.6024 14.6037 18.3333 10.0013 18.3333C5.39893 18.3333 1.66797 14.6024 1.66797 9.99999C1.66797 5.39762 5.39893 1.66666 10.0013 1.66666ZM9.16797 4.99999V5.93098C8.73963 6.00539 8.31673 6.16061 7.95866 6.42333C7.43727 6.80593 7.08475 7.39749 7.08464 8.14778C7.08464 9.05561 7.50609 9.68144 8.09538 10.0887C8.61485 10.4477 9.27299 10.6393 9.76123 10.7861C10.3188 10.9538 10.7039 11.0759 10.9681 11.2541C11.1606 11.3839 11.2512 11.5116 11.2513 11.7879C11.2513 11.9513 11.19 12.0689 11.0348 12.1794C10.854 12.3079 10.5527 12.4113 10.1689 12.43C9.34133 12.4703 8.66115 12.1227 8.45508 11.7106L6.96419 12.456C7.40602 13.3397 8.28481 13.8179 9.16797 14.0047V15H10.8346V14.0202C11.2491 13.9366 11.6551 13.7834 12.0016 13.5368C12.5364 13.1561 12.918 12.5598 12.918 11.7879C12.9179 10.8843 12.4874 10.2689 11.8991 9.87222C11.3821 9.52373 10.7254 9.33579 10.2414 9.19026C9.68799 9.02387 9.30437 8.89832 9.04264 8.71744C8.85081 8.58482 8.7513 8.44671 8.7513 8.14778C8.75139 7.97123 8.81557 7.86187 8.94499 7.76692C9.10112 7.65245 9.36872 7.55762 9.71973 7.54475C10.4683 7.51741 11.1216 7.85425 11.3392 8.28938L12.8301 7.54394C12.418 6.71976 11.6409 6.23565 10.8346 6.01724V4.99999H9.16797Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Tokenization — coins-add icon from prototype #ico-tokenize */
export function TokenizeIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5.0013 11.6667C5.0013 7.81793 7.90032 4.6463 11.6338 4.2163C10.5776 3.15612 9.11607 2.5 7.5013 2.5C4.27964 2.5 1.66797 5.11167 1.66797 8.33333C1.66797 10.7721 3.16458 12.8614 5.28948 13.7327C5.10181 13.0764 5.0013 12.3833 5.0013 11.6667Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.5013 17.5C15.723 17.5 18.3346 14.8883 18.3346 11.6667C18.3346 8.44501 15.723 5.83333 12.5013 5.83333C9.27964 5.83333 6.66797 8.44501 6.66797 11.6667C6.66797 14.8883 9.27964 17.5 12.5013 17.5ZM13.3346 9.16667H11.668V10.8333H10.0013V12.5H11.668V14.1667H13.3346V12.5H15.0013V10.8333H13.3346V9.16667Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Institutional Payments — bank/columns icon from prototype #ico-bank */
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

/** Enterprise — buildings icon from prototype #ico-enterprise */
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

/** Financial Infrastructure — hub/nodes icon from prototype #ico-infra */
export function InfraIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10.0001 7.29166C8.68565 7.29166 7.57429 6.42214 7.20982 5.22692C5.72564 5.96653 4.5763 7.27915 4.05211 8.87397L3.85695 9.46772L2.66945 9.07741L2.86461 8.48366C3.54833 6.40347 5.11557 4.72588 7.12298 3.89359C7.35246 2.51183 8.55325 1.45833 10.0001 1.45833C11.6109 1.45833 12.9168 2.76416 12.9168 4.37499C12.9168 5.98583 11.6109 7.29166 10.0001 7.29166Z"
        fill="currentColor"
      />
      <path
        d="M15.6553 5.90053L15.2447 5.42932L14.3023 6.25053L14.7129 6.72173C15.6706 7.82087 16.25 9.25635 16.25 10.8287C16.25 11.053 16.2382 11.2744 16.2153 11.4924C15.0604 11.3136 13.8622 11.844 13.2428 12.9169C12.4374 14.3117 12.9154 16.0953 14.3102 16.9006C15.705 17.7059 17.4886 17.228 18.2939 15.8331C19.062 14.5028 18.6628 12.8189 17.4141 11.9673C17.4707 11.5957 17.5 11.2154 17.5 10.8287C17.5 8.9431 16.8038 7.21857 15.6553 5.90053Z"
        fill="currentColor"
      />
      <path
        d="M6.75094 12.9169C7.34252 13.9415 7.24163 15.1759 6.59347 16.0782C7.57257 16.7142 8.74026 17.0833 9.9954 17.0833C10.397 17.0833 10.7892 17.0456 11.1688 16.9735L11.7828 16.8571L12.0158 18.0852L11.4018 18.2016C10.9457 18.2881 10.4755 18.3333 9.9954 18.3333C8.36676 18.3333 6.85801 17.8139 5.62769 16.932C4.24143 17.693 2.49439 17.2094 1.69979 15.8331C0.894479 14.4383 1.37239 12.6547 2.76722 11.8494C4.16206 11.0441 5.94563 11.522 6.75094 12.9169Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Real World Assets — storefront/mall icon from prototype #ico-rwa */
export function RwaIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.66797 3.33333H18.3346V16.6667H1.66797V3.33333ZM13.3346 15.4167V9.16666H10.6263V15.4167H13.3346ZM9.3763 15.4167V9.16666H6.66797V15.4167H9.3763Z"
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
