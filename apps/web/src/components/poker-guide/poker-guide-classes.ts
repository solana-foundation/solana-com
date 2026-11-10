// Shared Tailwind utilities for the index and chapter pages.
export const guide = {
  page: "relative isolate min-h-screen overflow-clip bg-[#080b12] font-[Diatype,Arial,sans-serif] text-[#f7f8fc]",
  ambient:
    "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_4%,rgba(153,69,255,0.14),transparent_28rem),radial-gradient(circle_at_90%_18%,rgba(0,194,255,0.08),transparent_24rem),radial-gradient(circle_at_72%_72%,rgba(20,241,149,0.06),transparent_30rem)]",
  container:
    "mx-auto w-[min(100%,1440px)] px-[4.5rem] max-[1100px]:px-8 max-[640px]:px-[1.2rem]",
  topbar:
    "flex min-h-20 items-center justify-between font-[DSemi,monospace] text-[0.72rem] uppercase tracking-[0.12em] max-[640px]:min-h-[4.4rem] max-[640px]:text-[0.62rem]",
  topbarEyebrow:
    "m-0 font-[inherit] text-inherit uppercase tracking-[inherit] text-[#14f195]",
  backLink:
    "inline-flex items-center gap-[0.7rem] text-[#9da8c0] transition-colors [transition-duration:180ms] ease-in-out hover:text-[#f7f8fc] focus-visible:text-[#f7f8fc] motion-reduce:transition-none",
  backMark: "font-[Diatype,sans-serif] text-base text-[#14f195]",
  wsopLink:
    "inline-flex items-center gap-[0.65rem] text-[#9da8c0] transition-colors [transition-duration:180ms] ease-in-out hover:text-[#f7f8fc] focus-visible:text-[#f7f8fc] motion-reduce:transition-none max-[640px]:[&>span:nth-child(2)]:max-w-32 max-[640px]:[&>span:nth-child(2)]:text-right max-[640px]:[&>span:nth-child(2)]:leading-[1.35]",
  wsopDot:
    "h-[0.48rem] w-[0.48rem] rounded-full bg-[#14f195] shadow-[0_0_0.9rem_rgba(20,241,149,0.75)]",
  eyebrow:
    "mb-5 font-[DSemi,monospace] text-[0.72rem] uppercase tracking-[0.15em] leading-[1.3] text-[#14f195]",
  hero: "grid min-h-[38rem] grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-center gap-14 py-14 pb-[6.5rem] max-[1100px]:gap-10 max-[850px]:min-h-0 max-[850px]:grid-cols-1 max-[850px]:gap-14 max-[850px]:py-[4.5rem] max-[850px]:pb-[5.5rem] max-[640px]:py-16 max-[640px]:pb-[4.8rem]",
  heroCopy: "relative z-[1]",
  heroTitle:
    "m-0 max-w-[45rem] text-balance font-[Diatype,Arial,sans-serif] text-[2rem] font-bold leading-[0.98] tracking-[-0.065em] text-[#f7f8fc] md:text-[2.5rem] xl:text-[4rem] max-[850px]:max-w-[38rem] max-[640px]:text-[2rem]",
  heroDescription:
    "mt-8 max-w-[36rem] text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.36] text-[#9da8c0] max-[640px]:text-[1.15rem]",
  heroActions: "mt-[2.4rem] flex flex-wrap items-center gap-[0.8rem]",
  heroCta:
    "inline-flex items-center gap-[0.6rem] border border-[#14f195] bg-[#14f195] px-[1.1rem] py-[0.8rem] font-[DSemi,monospace] text-[0.72rem] uppercase tracking-[0.08em] text-[#080b12] transition-colors [transition-duration:180ms] ease-in-out hover:bg-[#f7f8fc] focus-visible:bg-[#f7f8fc]",
  heroSecondaryCta:
    "inline-flex items-center gap-[0.6rem] border border-[rgba(152,166,198,0.2)] bg-transparent px-[1.1rem] py-[0.8rem] font-[DSemi,monospace] text-[0.72rem] uppercase tracking-[0.08em] text-[#f7f8fc] transition-colors [transition-duration:180ms] ease-in-out hover:bg-[#f7f8fc] hover:text-[#080b12] focus-visible:bg-[#f7f8fc] focus-visible:text-[#080b12]",
  heroArt:
    "relative rotate-[1.2deg] border border-[rgba(247,248,252,0.16)] bg-[rgba(14,20,32,0.62)] p-[0.7rem] shadow-[0_2.5rem_6rem_rgba(0,0,0,0.35)] [&_img]:block [&_img]:h-auto [&_img]:w-full max-[850px]:ml-4 max-[850px]:max-w-[48rem] max-[640px]:ml-[0.3rem] max-[640px]:p-[0.35rem]",
  heroArtLabel:
    "absolute bottom-[1.1rem] right-[1.2rem] bg-[rgba(8,11,18,0.84)] px-[0.6rem] py-[0.42rem] font-[DSemi,monospace] text-[0.64rem] uppercase tracking-[0.1em] text-[#f7f8fc]",
  chapterGrid:
    "border-t border-[rgba(152,166,198,0.2)] py-[5.5rem] pb-28 max-[850px]:pt-[4.5rem]",
  chapterGridHeader:
    "mb-12 max-w-[38rem] [&_h2]:m-0 [&_h2]:text-[clamp(2.4rem,5vw,4.5rem)] [&_h2]:font-bold [&_h2]:leading-[0.96] [&_h2]:tracking-[-0.06em] [&_h2]:text-[#f7f8fc]",
  cards:
    "grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1",
  card: "flex min-h-[17rem] flex-col border border-[rgba(152,166,198,0.2)] bg-[rgba(18,26,41,0.64)] p-6 text-[#f7f8fc] transition-[border-color,background,transform] [transition-duration:180ms] ease-in-out hover:-translate-y-1 hover:border-[#14f195] hover:bg-[rgba(20,241,149,0.08)] focus-visible:-translate-y-1 focus-visible:border-[#14f195] focus-visible:bg-[rgba(20,241,149,0.08)] max-[640px]:min-h-56",
  cardLabel:
    "font-[DSemi,monospace] text-[0.68rem] uppercase tracking-[0.08em] text-[#9da8c0]",
  cardTitle:
    "mt-[0.45rem] text-[clamp(1.35rem,2vw,1.8rem)] font-bold leading-[1.3] tracking-[-0.04em]",
  cardCta:
    "mt-auto flex justify-between pt-8 font-[DSemi,monospace] text-[0.68rem] uppercase tracking-[0.08em] text-[#14f195]",
  mobileChapterBar:
    "hidden max-[850px]:sticky max-[850px]:top-0 max-[850px]:z-10 max-[850px]:flex max-[850px]:items-center max-[850px]:justify-between max-[850px]:gap-4 max-[850px]:border-y max-[850px]:border-[rgba(152,166,198,0.2)] max-[850px]:bg-[rgba(8,11,18,0.9)] max-[850px]:py-[0.8rem] max-[850px]:backdrop-blur-[16px] max-[640px]:mx-[-0.1rem]",
  mobileChapterLabel:
    "m-0 font-[DSemi,monospace] text-[0.65rem] uppercase tracking-[0.15em] leading-[1.3] text-[#14f195] max-[640px]:text-[0.6rem]",
  mobileChapterSelect:
    "relative inline-flex min-w-[min(15rem,65vw)] items-center text-[#f7f8fc] [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-none [&_select]:border [&_select]:border-[rgba(152,166,198,0.2)] [&_select]:bg-[#0e1420] [&_select]:py-[0.55rem] [&_select]:pl-3 [&_select]:pr-8 [&_select]:font-[DSemi,monospace] [&_select]:text-[0.68rem] [&_select]:uppercase [&_select]:tracking-[0.05em] [&>span:last-child]:pointer-events-none [&>span:last-child]:absolute [&>span:last-child]:right-3 [&>span:last-child]:text-[#14f195]",
  readingFrame:
    "grid grid-cols-[minmax(0,1fr)_16rem] items-start gap-20 border-t border-[rgba(152,166,198,0.2)] py-[5.5rem] pb-32 max-[1100px]:gap-10 max-[850px]:block max-[850px]:pt-16",
  article: "min-w-0",
  content: [
    "max-w-[52rem] text-[1.16rem] leading-[1.64] text-[#dfe4ef] max-[640px]:text-[1.04rem]",
    "[&_.poker-guide-section]:m-0 [&_.poker-guide-section]:scroll-mt-28 [&_.poker-guide-section]:pb-[6.5rem] max-[640px]:[&_.poker-guide-section]:pb-[4.5rem]",
    "[&_.poker-guide-section+.poker-guide-section]:border-t [&_.poker-guide-section+.poker-guide-section]:border-[rgba(152,166,198,0.2)] [&_.poker-guide-section+.poker-guide-section]:pt-[6.5rem] max-[640px]:[&_.poker-guide-section+.poker-guide-section]:pt-[4.5rem]",
    "[&_.poker-guide-section-heading]:mb-[2.2rem] [&_.poker-guide-section-heading]:block max-[640px]:[&_.poker-guide-section-heading]:mb-[1.8rem]",
    "[&_.poker-guide-overline]:mb-5 [&_.poker-guide-overline]:font-[DSemi,monospace] [&_.poker-guide-overline]:text-[0.72rem] [&_.poker-guide-overline]:uppercase [&_.poker-guide-overline]:tracking-[0.15em] [&_.poker-guide-overline]:leading-[1.3] [&_.poker-guide-overline]:text-[#14f195]",
    "[&_.poker-guide-section_h2]:m-0 [&_.poker-guide-section_h2]:max-w-[44rem] [&_.poker-guide-section_h2]:font-[Diatype,Arial,sans-serif] [&_.poker-guide-section_h2]:text-[clamp(2.5rem,5vw,4.7rem)] [&_.poker-guide-section_h2]:font-bold [&_.poker-guide-section_h2]:leading-[0.98] [&_.poker-guide-section_h2]:tracking-[-0.055em] [&_.poker-guide-section_h2]:text-[#f7f8fc] max-[640px]:[&_.poker-guide-section_h2]:text-[clamp(2.5rem,13vw,4rem)]",
    "[&_.poker-guide-section_h3]:mt-[3.2rem] [&_.poker-guide-section_h3]:mb-[0.8rem] [&_.poker-guide-section_h3]:font-[Diatype,Arial,sans-serif] [&_.poker-guide-section_h3]:text-2xl [&_.poker-guide-section_h3]:font-bold [&_.poker-guide-section_h3]:leading-[1.16] [&_.poker-guide-section_h3]:tracking-[-0.02em] [&_.poker-guide-section_h3]:text-[#f7f8fc] max-[640px]:[&_.poker-guide-section_h3]:mt-10 max-[640px]:[&_.poker-guide-section_h3]:text-[1.35rem]",
    "[&_.poker-guide-section_p]:mb-[1.2rem] [&_.poker-guide-section_p]:mt-0 [&_.poker-guide-section_p]:max-w-[46rem]",
    "[&_.poker-guide-section_a]:text-[#14f195] [&_.poker-guide-section_a]:underline [&_.poker-guide-section_a]:decoration-[rgba(20,241,149,0.45)] [&_.poker-guide-section_a]:underline-offset-[0.18em] [&_.poker-guide-section_a:hover]:text-[#f7f8fc] [&_.poker-guide-section_a:hover]:decoration-[#f7f8fc] [&_.poker-guide-section_a:focus-visible]:text-[#f7f8fc] [&_.poker-guide-section_a:focus-visible]:decoration-[#f7f8fc]",
    "[&_.poker-guide-lede]:!max-w-[44rem] [&_.poker-guide-lede]:text-[clamp(1.35rem,2vw,1.8rem)] [&_.poker-guide-lede]:!leading-[1.35] [&_.poker-guide-lede]:tracking-[-0.02em] [&_.poker-guide-lede]:text-[#f7f8fc]",
    "[&_.poker-guide-list]:mt-[1.8rem] [&_.poker-guide-list]:mb-0 [&_.poker-guide-list]:grid [&_.poker-guide-list]:max-w-[47rem] [&_.poker-guide-list]:list-none [&_.poker-guide-list]:gap-[0.95rem] [&_.poker-guide-list]:p-0",
    "[&_.poker-guide-list_li]:relative [&_.poker-guide-list_li]:border [&_.poker-guide-list_li]:border-[rgba(152,166,198,0.2)] [&_.poker-guide-list_li]:bg-[rgba(18,26,41,0.64)] [&_.poker-guide-list_li]:pt-5 [&_.poker-guide-list_li]:pr-[1.2rem] [&_.poker-guide-list_li]:pb-[1.15rem] [&_.poker-guide-list_li]:pl-[1.2rem]",
    "[&_.poker-guide-list_li::before]:absolute [&_.poker-guide-list_li::before]:left-0 [&_.poker-guide-list_li::before]:top-0 [&_.poker-guide-list_li::before]:h-1 [&_.poker-guide-list_li::before]:w-20 [&_.poker-guide-list_li::before]:bg-[#14f195] [&_.poker-guide-list_li::before]:content-[''] [&_.poker-guide-list_strong]:text-[#f7f8fc]",
    "[&_.poker-guide-callout]:my-[2.4rem] [&_.poker-guide-callout]:border [&_.poker-guide-callout]:border-[rgba(0,194,255,0.28)] [&_.poker-guide-callout]:border-l-[0.28rem] [&_.poker-guide-callout]:border-l-[#00c2ff] [&_.poker-guide-callout]:bg-[linear-gradient(100deg,rgba(0,194,255,0.1),rgba(153,69,255,0.05))] [&_.poker-guide-callout]:px-[1.7rem] [&_.poker-guide-callout]:py-6 [&_.poker-guide-callout_p:last-child]:mb-0 [&_.poker-guide-callout_strong]:text-[#f7f8fc]",
    "[&_.poker-guide-warning]:border-[rgba(255,107,116,0.3)] [&_.poker-guide-warning]:border-l-[#ff6b74] [&_.poker-guide-warning]:bg-[linear-gradient(100deg,rgba(255,107,116,0.1),rgba(153,69,255,0.04))]",
    "[&_.poker-guide-art]:my-[2.8rem] [&_.poker-guide-art]:mb-[3.3rem] [&_.poker-guide-art]:border [&_.poker-guide-art]:border-[rgba(152,166,198,0.2)] [&_.poker-guide-art]:bg-[rgba(18,26,41,0.62)] [&_.poker-guide-art]:p-[0.55rem] [&_.poker-guide-art>span]:block [&_.poker-guide-art_img]:block [&_.poker-guide-art_img]:h-auto [&_.poker-guide-art_img]:w-full [&_.poker-guide-art_img]:rounded-none",
    "[&_.poker-guide-art>span>span:last-child]:mx-[0.45rem] [&_.poker-guide-art>span>span:last-child]:mt-[0.7rem] [&_.poker-guide-art>span>span:last-child]:mb-[0.25rem] [&_.poker-guide-art>span>span:last-child]:font-[DSemi,monospace] [&_.poker-guide-art>span>span:last-child]:text-[0.66rem] [&_.poker-guide-art>span>span:last-child]:uppercase [&_.poker-guide-art>span>span:last-child]:tracking-[0.04em] [&_.poker-guide-art>span>span:last-child]:leading-[1.4] [&_.poker-guide-art>span>span:last-child]:text-[#9da8c0]",
    "[&_.poker-guide-details]:my-[1.6rem] [&_.poker-guide-details]:border-y [&_.poker-guide-details]:border-[rgba(152,166,198,0.2)] [&_.poker-guide-details_summary]:flex [&_.poker-guide-details_summary]:cursor-pointer [&_.poker-guide-details_summary]:list-none [&_.poker-guide-details_summary]:items-center [&_.poker-guide-details_summary]:justify-between [&_.poker-guide-details_summary]:gap-4 [&_.poker-guide-details_summary]:py-[1.15rem] [&_.poker-guide-details_summary]:font-bold [&_.poker-guide-details_summary]:text-[#f7f8fc]",
    "[&_.poker-guide-details_summary::-webkit-details-marker]:hidden [&_.poker-guide-details_summary::after]:font-[DSemi,monospace] [&_.poker-guide-details_summary::after]:text-[1.4rem] [&_.poker-guide-details_summary::after]:font-normal [&_.poker-guide-details_summary::after]:text-[#14f195] [&_.poker-guide-details_summary::after]:content-['+'] [&_.poker-guide-details[open]_summary::after]:content-['−'] [&_.poker-guide-details>div]:pb-4 [&_.poker-guide-details>div_p:last-child]:mb-0",
    "[&_.poker-guide-checklist]:my-[1.8rem] [&_.poker-guide-checklist]:mb-8 [&_.poker-guide-checklist]:grid [&_.poker-guide-checklist]:grid-cols-2 [&_.poker-guide-checklist]:border [&_.poker-guide-checklist]:border-[rgba(152,166,198,0.2)] [&_.poker-guide-checklist]:bg-[#0e1420] max-[640px]:[&_.poker-guide-checklist]:grid-cols-1",
    "[&_.poker-guide-checklist>div]:min-h-full [&_.poker-guide-checklist>div]:border-0 [&_.poker-guide-checklist>div]:bg-transparent [&_.poker-guide-checklist>div]:p-[1.2rem] [&_.poker-guide-checklist>div:nth-child(odd):has(+div)]:border-r [&_.poker-guide-checklist>div:nth-child(odd):has(+div)]:border-[rgba(152,166,198,0.2)] max-[640px]:[&_.poker-guide-checklist>div:nth-child(odd):has(+div)]:border-r-0",
    "[&_.poker-guide-checklist>div:nth-child(-n+2):has(~div:nth-child(n+3))]:border-b [&_.poker-guide-checklist>div:nth-child(-n+2):has(~div:nth-child(n+3))]:border-[rgba(152,166,198,0.2)] max-[640px]:[&_.poker-guide-checklist>div:not(:last-child)]:border-b max-[640px]:[&_.poker-guide-checklist>div:not(:last-child)]:border-[rgba(152,166,198,0.2)]",
    "[&_.poker-guide-checklist_strong]:mb-[0.4rem] [&_.poker-guide-checklist_strong]:block [&_.poker-guide-checklist_strong]:font-[DSemi,monospace] [&_.poker-guide-checklist_strong]:text-[0.7rem] [&_.poker-guide-checklist_strong]:uppercase [&_.poker-guide-checklist_strong]:tracking-[0.09em] [&_.poker-guide-checklist_strong]:text-[#14f195] [&_.poker-guide-checklist_p]:m-0 [&_.poker-guide-checklist_p]:text-base [&_.poker-guide-checklist_p]:leading-[1.45] [&_.poker-guide-checklist_p]:text-[#9da8c0]",
    "[&_.poker-guide-compare]:my-[1.8rem] [&_.poker-guide-compare]:mb-8 [&_.poker-guide-compare]:grid [&_.poker-guide-compare]:grid-cols-2 [&_.poker-guide-compare]:gap-[0.8rem] max-[640px]:[&_.poker-guide-compare]:grid-cols-1",
    "[&_.poker-guide-compare>div]:border [&_.poker-guide-compare>div]:border-[rgba(152,166,198,0.2)] [&_.poker-guide-compare>div]:bg-[#0e1420] [&_.poker-guide-compare>div]:p-[1.35rem] [&_.poker-guide-compare>div:first-child]:border-[rgba(20,241,149,0.34)] [&_.poker-guide-compare>div:last-child]:border-[rgba(255,107,116,0.34)]",
    "[&_.poker-guide-compare_h3]:mt-0 [&_.poker-guide-compare_h3]:mb-[0.6rem] [&_.poker-guide-compare_h3]:text-xl [&_.poker-guide-compare_h3]:font-bold [&_.poker-guide-compare_p]:m-0 [&_.poker-guide-compare_p]:text-base [&_.poker-guide-compare_p]:leading-[1.45] [&_.poker-guide-compare_p]:text-[#9da8c0]",
  ].join(" "),
  rail: "sticky top-[6.5rem] min-w-0 pb-4 max-[850px]:hidden",
  railHeader: "mb-[1.4rem] flex items-baseline justify-between gap-4",
  railKicker:
    "m-0 font-[DSemi,monospace] text-[0.65rem] uppercase tracking-[0.15em] leading-[1.3] text-[#14f195]",
  railCount:
    "font-[DSemi,monospace] text-[0.62rem] uppercase tracking-[0.05em] text-[#66718b]",
  railNav: "grid gap-[0.3rem]",
  railItem:
    "relative block w-full py-[0.72rem] text-start text-[#9da8c0] hover:text-[#f7f8fc] focus-visible:text-[#f7f8fc]",
  railItemActive: "text-[#f7f8fc] [&_.guide-rail-label]:text-[#14f195]",
  railItemContent: "block min-w-0",
  railLabel:
    "guide-rail-label mb-[0.18rem] block font-[DSemi,monospace] text-[0.62rem] uppercase tracking-[0.05em] text-[#68738c]",
  railTitle: "block text-[0.94rem] leading-[1.22]",
  railCta:
    "mt-[1.9rem] flex items-center justify-between gap-[0.8rem] border-y border-[rgba(152,166,198,0.2)] py-[0.8rem] font-[DSemi,monospace] text-[0.66rem] uppercase tracking-[0.06em] leading-[1.4] text-[#14f195] transition-[color,transform] [transition-duration:180ms] ease-in-out hover:translate-x-[0.15rem] hover:text-[#f7f8fc] focus-visible:translate-x-[0.15rem] focus-visible:text-[#f7f8fc] motion-reduce:transition-none",
  footer:
    "flex items-end justify-between gap-8 border-t border-[rgba(152,166,198,0.2)] py-[2.3rem] pb-12 max-[640px]:block max-[640px]:pb-[2.3rem]",
  footerKicker:
    "mb-[0.7rem] font-[DSemi,monospace] text-[0.72rem] uppercase tracking-[0.15em] leading-[1.3] text-[#9945ff]",
  footerTitle:
    "m-0 font-[Diatype,Arial,sans-serif] text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[0.96] tracking-[-0.05em] text-[#f7f8fc]",
  footerLink:
    "inline-flex items-center gap-[0.8rem] border-b border-[#14f195] pb-[0.45rem] font-[DSemi,monospace] text-[0.72rem] uppercase tracking-[0.08em] text-[#14f195] transition-colors [transition-duration:180ms] ease-in-out hover:text-[#f7f8fc] focus-visible:text-[#f7f8fc] motion-reduce:transition-none max-[640px]:mt-8",
} as const;
