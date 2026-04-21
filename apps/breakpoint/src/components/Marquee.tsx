"use client";

import React from "react";

const NOISE_A = "#∞@±∑!÷?^&∆*≠6≈%{/~|]!^";
const NOISE_B = "÷∆*?∞±#≈1%}";
const NOISE_C = "÷!∑∆^*?&±#≈%2|~][/∆÷≈!^#∑@&≠*?5±∞%[~}|/*?!≈∑÷@^∆#&±≠∞%7[/~{}";
const NOISE_D = "±∑!÷?^&∆*≠6≈%{/~|";
const NOISE_E = "#∞@±∑!÷?^&∆*≠6≈%{/~|]!^#∞@±∑!÷?^&∆*≠6≈%{/~|]!^";

const TICKER: { text: string; highlight?: boolean }[] = [
  { text: NOISE_A },
  { text: "BP26", highlight: true },
  { text: NOISE_B },
  { text: "LDN", highlight: true },
  { text: NOISE_C },
  { text: "BUILD", highlight: true },
  { text: NOISE_D },
  { text: "DEPLOY", highlight: true },
  { text: NOISE_E },
  { text: "SHIP MORE", highlight: true },
  { text: NOISE_B + NOISE_C },
  { text: "BUILD", highlight: true },
  { text: NOISE_D },
  { text: "DEPLOY", highlight: true },
  { text: NOISE_A },
];

function TickerRow() {
  return (
    <>
      {TICKER.map((segment, i) => (
        <span
          key={i}
          className={
            segment.highlight ? "px-4 text-purple" : "text-neutral-600"
          }
        >
          {segment.text}
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-black pt-[64px]">
      <div className="flex whitespace-nowrap">
        <span className="inline-flex min-w-max animate-ticker items-center font-mono text-[14px] uppercase tracking-[0.08em] leading-[1.3]">
          <TickerRow />
        </span>
        <span
          className="inline-flex min-w-max animate-ticker items-center pl-4 font-mono text-[14px] uppercase tracking-[0.08em] leading-[1.3]"
          aria-hidden="true"
        >
          <TickerRow />
        </span>
      </div>
    </div>
  );
}
