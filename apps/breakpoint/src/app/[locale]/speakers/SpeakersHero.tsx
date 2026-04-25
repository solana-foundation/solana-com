const APPLY_TO_SPEAK_HREF =
  "mailto:breakpoint@solana.org?subject=Breakpoint%202026%20speaker%20application";

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      width="8.02"
      height="8"
      viewBox="0 0 8.01975 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M1.24444 8L0 6.7358L4.95803 1.79753H1.12593V0H8.01975V6.85432H6.20247V3.06173L1.24444 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SpeakersHero() {
  return (
    <section className="relative h-[430px] overflow-hidden bg-black md:h-[467px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        <img
          src="/img/registration-hero-glitch.png"
          alt=""
          width={1200}
          height={800}
          className="absolute left-1/2 top-[-320px] h-[960px] w-[1440px] max-w-none -translate-x-1/2 object-cover md:top-[-340px]"
        />
        <div className="absolute inset-0 bg-green mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.18)_54%,rgba(0,0,0,0.72)_100%)]" />
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute left-0 top-[160px] h-[200px] w-full min-w-[840px] object-cover"
      />

      <div className="absolute left-5 right-5 top-[236px] flex flex-col items-start gap-8 pb-3 text-white md:left-8 md:right-auto md:top-[252px] md:w-[1026px]">
        <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
          Breakpoint 2026
        </p>
        <h1 className="font-sans text-[56px] font-normal leading-[0.98] tracking-[-0.06em] text-white md:text-[80px]">
          Speakers
        </h1>
        <a
          href={APPLY_TO_SPEAK_HREF}
          className="inline-flex h-10 items-center justify-center gap-3 bg-white px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black transition-colors hover:bg-[#e7d2f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Apply to speak
          <span className="inline-flex size-3 items-center justify-center">
            <ArrowUpRight />
          </span>
        </a>
      </div>
    </section>
  );
}
