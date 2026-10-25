/**
 * Small interface icons of the docs chrome (sidebar chevrons, TOC heading,
 * page actions, callouts). Line icons on an 18 or 24 unit grid; the 24 unit
 * ones are Lucide (ISC).
 */
import type { ReactNode } from "react";

function Icon18({
  children,
  className,
  strokeWidth = 2,
}: {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function Lucide({
  children,
  className,
  size = 16,
  strokeWidth = 2,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Filled caret pointing down; the accordion rotates it right when closed. */
export function CaretIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M14.0238 4.00002H3.97576C3.33776 4.00002 2.74976 4.34702 2.44276 4.90602C2.13576 5.46502 2.15576 6.14802 2.49776 6.68702L7.52176 14.61C7.84476 15.119 8.39676 15.422 8.99976 15.422C9.60276 15.422 10.1548 15.118 10.4778 14.61L15.5028 6.68602C15.8438 6.14702 15.8648 5.46402 15.5578 4.90502C15.2508 4.34602 14.6628 3.99902 14.0248 3.99902L14.0238 4.00002Z" />
    </svg>
  );
}

/** Opens elsewhere (external nav links). */
export function ExternalArrowIcon({ className }: { className?: string }) {
  return (
    <Icon18 className={className}>
      <path d="M14.25 3.75L3.75525 14.2446" />
      <path d="M4.71301 3.75H14.2499V13.2869" />
    </Icon18>
  );
}

/** Points right; rotated by CSS when open. */
export function ChevronIcon({
  className,
  strokeWidth,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <Icon18 className={className} strokeWidth={strokeWidth}>
      <path d="M6.5 2.75L12.75 9L6.5 15.25" />
    </Icon18>
  );
}

export function TocIcon({ className }: { className?: string }) {
  return (
    <Icon18 className={className}>
      <path d="M2.75 14.25H15.25" />
      <path d="M2.75 3.75H15.25" />
      <path d="M2.75 9H8.25" />
    </Icon18>
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <Icon18 className={className} strokeWidth={1.5}>
      <path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" />
      <path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" />
    </Icon18>
  );
}

/** Sparkles: ask the assistant about a code block. */
export function SparkleIcon({ className }: { className?: string }) {
  return (
    <Icon18 className={className} strokeWidth={1.5}>
      <path
        d="M5.65799 2.99L4.39499 2.569L3.97399 1.306C3.83699 0.898 3.16199 0.898 3.02499 1.306L2.60399 2.569L1.34099 2.99C1.13699 3.058 0.998993 3.249 0.998993 3.464C0.998993 3.679 1.13699 3.87 1.34099 3.938L2.60399 4.359L3.02499 5.622C3.09299 5.826 3.28499 5.964 3.49999 5.964C3.71499 5.964 3.90599 5.826 3.97499 5.622L4.39599 4.359L5.65899 3.938C5.86299 3.87 6.00099 3.679 6.00099 3.464C6.00099 3.249 5.86199 3.058 5.65799 2.99Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z" />
    </Icon18>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <path d="M20 6 9 17l-5-5" />
    </Lucide>
  );
}

export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </Lucide>
  );
}

export function MarkdownIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 15V9l3 3 3-3v6" />
      <path d="M15 12l2 2 2-2" />
      <path d="M17 9v5" />
    </Lucide>
  );
}

export function OpenAiIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

export function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

/** Callout icon drawings, as the docs have always drawn them (18px grid). */
const CALLOUT_ICONS: Record<string, string> = {
  note: '<path d="M 9 1.6714 C 13.0371 1.6714 16.3286 4.9629 16.3286 9 C 16.3286 13.0371 13.0371 16.3286 9 16.3286 C 7.0574 16.3252 5.1953 15.552 3.8217 14.1783 C 2.448 12.8047 1.6748 10.9426 1.6714 9 C 1.6714 4.9629 4.9629 1.6714 9 1.6714 Z M 9 0 C 4.0371 0 0 4.0371 0 9 C 0 13.9629 4.0371 18 9 18 C 13.9629 18 18 13.9629 18 9 C 18 4.0371 13.9629 0 9 0 Z M 10.2857 3.8571 H 7.7143 V 10.2857 H 10.2857 V 3.8571 Z M 10.2857 11.5714 H 7.7143 V 14.1429 H 10.2857 V 11.5714 Z" fill="currentColor" stroke="none" fill-rule="evenodd" clip-rule="evenodd"></path>',
  warning:
    '<path d="M 9 6.75 v 1.5 m 0 3 h 0.0075 m -5.2035 3 h 10.392 c 1.155 0 1.8765 -1.2503 1.299 -2.25 L 10.299 3 c -0.5775 -0.9997 -2.0205 -0.9997 -2.598 0 L 2.505 12 c -0.5775 0.9997 0.144 2.25 1.299 2.25 z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
  info: '<path d="M 7.2 0 C 3.2231 0 0 3.2231 0 7.2 C 0 11.1768 3.2231 14.4 7.2 14.4 C 11.1768 14.4 14.4 11.1768 14.4 7.2 C 14.4 3.2231 11.1768 0 7.2 0 Z M 7.2 13.05 C 3.9741 13.05 1.35 10.4257 1.35 7.2 C 1.35 3.9743 3.9741 1.35 7.2 1.35 C 10.426 1.35 13.05 3.9743 13.05 7.2 C 13.05 10.4257 10.426 13.05 7.2 13.05 Z M 8.325 9.45 H 7.875 V 6.975 C 7.875 6.6038 7.5741 6.3 7.2 6.3 H 6.3 C 5.9288 6.3 5.625 6.6038 5.625 6.975 C 5.625 7.3462 5.9288 7.65 6.3 7.65 H 6.525 V 9.45 H 6.075 C 5.7038 9.45 5.4 9.7538 5.4 10.125 C 5.4 10.4962 5.7038 10.8 6.075 10.8 H 8.325 C 8.6977 10.8 9 10.4977 9 10.125 C 9 9.7523 8.6991 9.45 8.325 9.45 Z M 7.2 5.4 C 7.697 5.4 8.1 4.997 8.1 4.5 C 8.1 4.003 7.697 3.6 7.2 3.6 C 6.703 3.6 6.3 4.0022 6.3 4.5 C 6.3 4.9978 6.7022 5.4 7.2 5.4 Z" fill="currentColor" stroke="none"></path>',
  tip: '<path d="M 4.0216 15.9727 C 4.0216 16.1941 4.0855 16.4101 4.2074 16.5947 L 4.81 17.4979 C 4.9946 17.7747 5.4137 18 5.7467 18 H 7.9149 C 8.2468 18 8.6659 17.775 8.8505 17.4979 L 9.451 16.5951 C 9.5543 16.439 9.6391 16.1601 9.6391 15.9727 L 9.6436 14.5945 H 4.0181 L 4.0216 15.9727 Z M 6.8308 0 C 3.2453 0.0113 0.6429 2.9171 0.6429 6.1563 C 0.6429 7.7167 1.2209 9.1392 2.1744 10.2278 C 2.7556 10.8901 3.663 12.2751 4.0104 13.443 C 4.0115 13.4518 4.0137 13.4612 4.0148 13.4706 H 9.6473 C 9.6483 13.4612 9.6505 13.4524 9.6517 13.443 C 9.9988 12.2751 10.9065 10.8901 11.4877 10.2278 C 12.4422 9.1695 13.0189 7.749 13.0189 6.1563 C 13.0189 2.7705 10.2483 0.0001 6.8308 0 Z M 10.2202 9.1449 C 9.6696 9.7724 8.9882 10.7727 8.4956 11.8131 H 5.1692 C 4.6766 10.7727 3.9953 9.7724 3.445 9.1452 C 2.7257 8.3257 2.3305 7.2463 2.3305 6.1563 C 2.3305 3.9835 4.0216 1.6964 6.7992 1.6876 C 9.3131 1.6876 11.3312 3.7058 11.3312 6.1563 C 11.3312 7.2463 10.9374 8.3257 10.2202 9.1449 Z M 6.2683 2.8127 C 4.7178 2.8127 3.4556 4.0749 3.4556 5.6254 C 3.4556 5.9364 3.7072 6.188 4.0181 6.188 C 4.3291 6.188 4.5807 5.9348 4.5807 5.6254 C 4.5807 4.6948 5.3376 3.9378 6.2683 3.9378 C 6.5792 3.9378 6.8308 3.6865 6.8308 3.3756 C 6.8308 3.0647 6.5777 2.8127 6.2683 2.8127 Z" fill="currentColor" stroke="none"></path>',
  danger:
    '<path d="M 0.6012 10.2656 c -0.4535 -0.784 -0.4535 -1.7473 0 -2.5312 L 3.7055 2.359 c 0.4535 -0.784 1.2867 -1.2656 2.1938 -1.2656 l 6.2086 0 c 0.9035 0 1.7402 0.4816 2.1938 1.2656 L 17.3988 7.7344 c 0.4535 0.784 0.4535 1.7473 0 2.5312 L 14.2945 15.641 c -0.4535 0.784 -1.2867 1.2656 -2.1938 1.2656 l -6.2086 0 c -0.9035 0 -1.7402 -0.4816 -2.1938 -1.2656 L 0.6012 10.2656 z m 1.4625 -1.6875 c -0.1512 0.2602 -0.1512 0.5836 0 0.8438 l 3.1043 5.3754 c 0.1512 0.2602 0.4289 0.4219 0.7313 0.4219 l 6.2086 0 c 0.3023 0 0.5801 -0.1617 0.7313 -0.4219 L 15.9398 9.4219 c 0.1512 -0.2602 0.1512 -0.5836 0 -0.8438 L 12.8355 3.2027 c -0.1512 -0.2602 -0.4289 -0.4219 -0.7313 -0.4219 l -6.2086 0 c -0.3023 0 -0.5801 0.1617 -0.7313 0.4219 L 2.0602 8.5781 z M 9 4.5 c 0.4676 0 0.8438 0.3762 0.8438 0.8438 l 0 3.9375 c 0 0.4676 -0.3762 0.8438 -0.8438 0.8438 s -0.8438 -0.3762 -0.8438 -0.8438 l 0 -3.9375 c 0 -0.4676 0.3762 -0.8438 0.8438 -0.8438 z M 7.875 12.375 a 1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 1 1 -2.25 0 z" fill="currentColor" stroke="none"></path>',
};

/** Callout icons: note, info, tip, warning, danger; check (Lucide). */
export function CalloutIcon({ type }: { type: string }) {
  const cls = "callout-svg";
  const drawing =
    CALLOUT_ICONS[type] ?? (type === "check" ? null : CALLOUT_ICONS.note);
  if (drawing)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={cls}
        dangerouslySetInnerHTML={{ __html: drawing }}
      />
    );
  return (
    <Lucide className={cls}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Lucide>
  );
}
