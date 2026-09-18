import Image from "next/image";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";

function ArtworkCrop({
  src,
  alt,
  position = "center",
  className = "",
}: {
  src: string;
  alt: string;
  position?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={`${uploadRoot}/${src}`}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 767px) 100vw, 50vw"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

export function SummerSchoolHero() {
  return (
    <section className="not-prose mx-auto grid w-full max-w-[1512px] overflow-hidden border-y border-white/15 bg-[#191918] md:grid-cols-[1fr_1.12fr_1fr]">
      <ArtworkCrop
        src="hero-left.webp"
        alt="Hand-drawn Summer School sneaker illustration"
        className="min-h-64 md:min-h-[560px]"
      />
      <div className="relative flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center md:min-h-[560px] md:px-10">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#14f195]">
          Solana presents
        </p>
        <h2 className="max-w-md text-5xl leading-[0.82] text-white md:text-7xl">
          Summer School
        </h2>
        <p className="mt-7 max-w-[23rem] text-base leading-7 text-white/85 md:text-lg">
          Students from around the world. Five weeks of live classes. Four weeks
          of capstone building. One demo day.
        </p>
        <p className="mt-8 text-xl text-[#14f195] md:text-3xl">
          June 15—August 15, 2026
        </p>
      </div>
      <ArtworkCrop
        src="hero-right.webp"
        alt="Hand-drawn Summer School technology collage"
        className="min-h-64 md:min-h-[560px]"
      />
    </section>
  );
}

const numbers = [
  ["1,164", "applicants"],
  ["69", "countries"],
  ["5", "weeks of live classes"],
  ["4", "weeks building"],
  ["20", "demo-day teams"],
] as const;

export function SummerSchoolNumbers() {
  return (
    <section className="not-prose mx-auto grid w-full max-w-[1512px] overflow-hidden border-y border-white/15 bg-[#191918] md:grid-cols-[1.25fr_0.75fr]">
      <ArtworkCrop
        src="numbers-map.webp"
        alt="Hand-drawn world map"
        className="min-h-80 md:min-h-[600px]"
      />
      <div className="flex flex-col justify-center px-7 py-14 md:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#9945ff]">
          Field report
        </p>
        <h2 className="mt-4 text-5xl leading-none text-white md:text-7xl">
          The numbers
        </h2>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/20 pt-8">
          {numbers.map(([value, label]) => (
            <div key={label} className="last:col-span-2">
              <dt className="text-xs uppercase tracking-[0.16em] text-white/55">
                {label}
              </dt>
              <dd className="m-0 mt-1 text-4xl leading-none text-[#14f195] md:text-5xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const curriculum = [
  [
    "Week 1",
    "Solana architecture, transactions, PDAs, Rust, Anchor",
    "curriculum-01.webp",
  ],
  [
    "Week 2",
    "Token Extensions, Token-2022, transfer hooks",
    "curriculum-02.webp",
  ],
  [
    "Week 3",
    "Pinocchio, native Rust, zero-copy, compute units",
    "curriculum-03.webp",
  ],
  ["Week 4", "Metaplex, Codama, NFTs, generated clients", "curriculum-04.webp"],
  [
    "Week 5",
    "Events, Geyser, Yellowstone, real-time listeners",
    "curriculum-05.webp",
  ],
  [
    "Weeks 6–9",
    "Project-focused office hours and demo-day prep",
    "curriculum-06.webp",
  ],
] as const;

export function SummerSchoolCurriculum() {
  return (
    <section className="not-prose mx-auto w-full max-w-[1512px] border-y border-white/15 bg-[#191918] px-6 py-16 md:px-12 md:py-24">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#ffe45e]">
          Syllabus
        </p>
        <h2 className="mt-4 text-5xl leading-none text-white md:text-7xl">
          The curriculum
        </h2>
      </div>
      <ol className="mt-12 grid list-none gap-px overflow-hidden border border-white/15 bg-white/15 p-0 md:grid-cols-2 lg:grid-cols-3">
        {curriculum.map(([week, detail, image], index) => (
          <li key={week} className="min-h-48 bg-[#191918] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <span className="text-[#14f195]">0{index + 1}</span>
              <Image
                src={`${uploadRoot}/${image}`}
                alt=""
                width={55}
                height={55}
                className="size-11 object-contain"
              />
            </div>
            <h3 className="mt-5 text-3xl leading-none text-white">{week}</h3>
            <p className="mt-4 text-sm leading-6 text-white/70">{detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const lecturers = [
  ["Cat McGee", "Developer Relations Engineer", "lecturer-cat.webp"],
  ["Dev Bharel", "Developer Relations Engineer, AI", "lecturer-dev.webp"],
  ["Dean Little", "Founder, Blueshift", "lecturer-dean.webp"],
  ["Chaerin Kim", "Developer Relations", "lecturer-chaerin.webp"],
  ["André Correia", "Head of Developer Relations", "lecturer-andre.webp"],
  ["Jacob Creech", "VP of Technology", "lecturer-jacob.webp"],
] as const;

export function SummerSchoolLecturers() {
  return (
    <section className="not-prose mx-auto w-full max-w-[1512px] border-y border-white/15 bg-[#191918] px-6 py-16 md:px-12 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#ffe45e]">
            Office hours
          </p>
          <h2 className="mt-4 text-5xl leading-none text-white md:text-7xl">
            Guest lecturers
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-white/65">
          Six people building and teaching across the Solana ecosystem.
        </p>
      </div>
      <ul className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {lecturers.map(([name, role, image]) => (
          <li
            key={name}
            className="overflow-hidden border border-white/15 bg-[#151514]"
          >
            <ArtworkCrop
              src={image}
              alt={`Portrait of ${name}`}
              className="aspect-[1.55/1]"
            />
            <div className="border-t border-white/15 p-5">
              <h3 className="text-2xl leading-none text-white">{name}</h3>
              <p className="mt-2 text-sm text-white/60">{role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const nextSteps = [
  [
    "Solana School",
    "Fall class",
    "Continue from first principles to a finished build.",
    "next-fall-class.webp",
  ],
  [
    "University Ambassador",
    "Program",
    "Bring Solana education to your campus.",
    "next-ambassador.webp",
  ],
] as const;

export function SummerSchoolNextSteps() {
  return (
    <section className="not-prose mx-auto w-full max-w-[1512px] border-y border-white/15 bg-[#191918] px-6 py-16 md:px-12 md:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#14f195]">
        Next semester
      </p>
      <h2 className="mt-4 text-5xl leading-none text-white md:text-7xl">
        What’s next?
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {nextSteps.map(([eyebrow, title, description, image]) => (
          <a
            key={title}
            href="https://solana.com/developers"
            className="group overflow-hidden border border-white/15 text-white no-underline transition-colors hover:border-[#14f195] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14f195]"
          >
            <ArtworkCrop
              src={image}
              alt={`${eyebrow} illustrated card`}
              className="aspect-[1.25/1]"
            />
            <div className="p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#14f195]">
                {eyebrow}
              </p>
              <h3 className="mt-3 text-4xl leading-none">{title}</h3>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                {description}
              </p>
              <span className="mt-7 inline-block text-sm font-bold text-[#14f195]">
                Learn more ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
