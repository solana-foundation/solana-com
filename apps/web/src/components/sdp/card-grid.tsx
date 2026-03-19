import Image from "next/image";

const columns = [
  {
    num: "1",
    img: "/src/img/solutions/sdp/feat-1.svg",
    bg: "/src/img/solutions/sdp/feat-bg-1.jpg",
    heading: "Issuance",
    body: "Launch GENIUS-compliant tokenized assets across deposits, stablecoins and RWAs with permissioning and privacy built-in.",
  },
  {
    num: "2",
    img: "/src/img/solutions/sdp/feat-2.svg",
    bg: "/src/img/solutions/sdp/feat-bg-2.jpg",
    heading: "Payments",
    body: "Orchestrate fiat and stablecoin flows — on-ramp, off-ramp, and onchain transactions across B2B, B2C, and P2P use cases.",
  },
  {
    num: "3",
    img: "/src/img/solutions/sdp/feat-3.svg",
    bg: "/src/img/solutions/sdp/feat-bg-3.jpg",
    heading: "Trading",
    body: "Support financial flows including atomic swaps, vaults, onchain FX and more. (Coming later in 2026)",
  },
];

export function CardGrid(): React.ReactElement {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="xl:border-l xl:border-r border-[#ffffff14] flex flex-col items-start max-w-[1440px] w-full overflow-clip">
        {/* Row 1: heading */}
        <div className="flex flex-col items-start px-5 md:px-8 xl:px-12 py-10 md:py-20 w-full">
          <h2 className="nd-heading-l-a text-white xl:max-w-[733px]">
            A single, unified interface to issue, move and trade tokenized
            assets
          </h2>
        </div>

        {/* Row 2: cards
            Mobile  (<md):  flex-col — image top, content bottom, full-width
            Tablet  (md):   flex-col — each card is flex-row (image left, content right)
            Desktop (xl):   flex-row — 3 columns side by side, each card is flex-col
        */}
        <div className="w-full overflow-clip xl:border-t xl:border-[#ffffff14] px-3 xl:px-0 flex flex-col xl:flex-row">
          {columns.map((col, i) => (
            <div
              key={col.num}
              className={[
                "flex flex-1 min-w-0 flex-col md:flex-row xl:flex-col",
                // Mobile/tablet: full border around each card
                "border border-[#ffffff14]",
                // Collapse duplicate top border on subsequent cards
                i > 0 ? "max-xl:border-t-0" : "",
                // Desktop: remove card borders, reset margin
                "xl:border-0 xl:mt-0",
                // Desktop: right divider between columns (except last)
                i < columns.length - 1 ? "xl:border-r" : "max-xl:border-b-0",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[960/830] w-full md:flex-1 xl:flex-none xl:aspect-auto xl:h-[415px] shrink-0">
                <img
                  src={col.bg}
                  alt=""
                  className="absolute inset-0 object-cover pointer-events-none"
                />
                <Image
                  src={col.img}
                  alt=""
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 75vw, 100vw"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-6 items-start px-5 py-8 md:flex-1 xl:flex-none xl:p-12 w-full">
                {/* Number circle */}
                <div className="flex items-center justify-center border border-white rounded-full size-7 shrink-0">
                  <span className="nd-body-xs text-white">{col.num}</span>
                </div>

                {/* Heading + body */}
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="nd-heading-s text-white">{col.heading}</h3>
                  <p className="nd-body-s text-white/[0.64]">{col.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
