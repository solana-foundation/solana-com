import Image from "next/image";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";
const figmaRoot =
  "https://www.figma.com/design/Luylq1JM1lfjdhTwNyFHAo/Solana.-Summer-School-Recap-Zine";

const screenshots = [
  {
    image: "project-01.webp",
    project: "Quant Royale",
    href: "https://x.com/quantroyale",
    node: "170-767",
  },
  {
    image: "project-02.webp",
    project: "Polaris Oracle",
    node: "170-769",
  },
  {
    image: "project-03.webp",
    project: "P-Loop",
    node: "170-771",
  },
  {
    image: "project-04.webp",
    project: "ZKGate",
    href: "https://zkgate.io",
    node: "170-773",
  },
  {
    image: "project-05.webp",
    project: "ZKGate",
    href: "https://zkgate.io",
    node: "170-775",
  },
  {
    image: "project-06.webp",
    project: "Grail",
    node: "170-777",
  },
  {
    image: "project-07.webp",
    project: "AgentVault",
    node: "170-779",
  },
  {
    image: "project-08.webp",
    project: "Quant Royale",
    href: "https://x.com/quantroyale",
    node: "170-781",
  },
  {
    image: "project-09.webp",
    project: "Polaris Oracle",
    node: "170-783",
  },
  {
    image: "project-10.webp",
    project: "Ashlar",
    node: "170-785",
  },
  {
    image: "project-11.webp",
    project: "Backr",
    href: "https://backrwaitlist.com",
    node: "170-787",
  },
  {
    image: "project-12.webp",
    project: "Polaris Oracle",
    node: "170-789",
  },
  {
    image: "project-13.webp",
    project: "Ashlar",
    node: "170-791",
  },
] as const;

export function StudentProjects() {
  return (
    <section className="not-prose mx-auto w-full max-w-[1512px] px-6 py-20 md:px-10 md:py-28">
      <div className="mb-10 flex items-end justify-between gap-8 md:mb-14">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#14f195]">
            Demo day archive
          </p>
          <h2 className="text-5xl font-light leading-none tracking-[-0.05em] text-white md:text-7xl">
            Student projects
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 md:block">
          Scroll through the exported capstone screens. Each card opens its
          public project or the exact source frame in Figma.
        </p>
      </div>

      <div className="grid snap-x snap-mandatory auto-cols-[88%] grid-flow-col gap-5 overflow-x-auto pb-6 [scrollbar-color:#14f195_#2b2b2a] [scrollbar-width:thin] md:auto-cols-[48%] lg:auto-cols-[34%]">
        {screenshots.map((screenshot, index) => {
          const href =
            "href" in screenshot
              ? screenshot.href
              : `${figmaRoot}?node-id=${screenshot.node}&p=f&m=dev`;

          return (
            <a
              key={screenshot.image}
              href={href}
              aria-label={`Open ${screenshot.project} project screenshot ${index + 1}`}
              target="_blank"
              rel="noreferrer"
              className="group snap-start overflow-hidden border border-white/15 bg-[#111] text-white no-underline outline-none transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#14f195] focus-visible:ring-offset-4 focus-visible:ring-offset-[#191918] motion-reduce:transform-none"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <Image
                  src={`${uploadRoot}/${screenshot.image}`}
                  alt={`${screenshot.project} capstone presentation screenshot`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
                  sizes="(max-width: 767px) 88vw, (max-width: 1023px) 48vw, 34vw"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/15 px-5 py-4">
                <span className="text-lg font-medium">
                  {screenshot.project}
                </span>
                <span className="text-xs font-bold text-[#14f195]">
                  {String(index + 1).padStart(2, "0")} ↗
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
