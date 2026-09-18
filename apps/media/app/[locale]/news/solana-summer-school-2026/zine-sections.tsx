import Image from "next/image";
import styles from "./summer-school.module.css";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";
const figmaRoot = `${uploadRoot}/figma`;

const curriculum = [
  {
    week: "Week 1:",
    detail:
      "Intro to Solana. Architecture, transactions, PDAs, Rust, Anchor. First vault and escrow programs.",
    icon: "week-1-star.svg",
  },
  {
    week: "Week 2:",
    detail:
      "Token Extensions. Token 2022, transfer hooks, rate limits. Challenge: build a stablecoin.",
    icon: "week-2-heart.svg",
  },
  {
    week: "Week 3:",
    detail:
      "Pinocchio. Dropping Anchor for native Rust. Zero-copy patterns, compute unit optimization.",
    icon: "week-3-lightning.svg",
  },
  {
    week: "Week 4:",
    detail:
      "Metaplex & Codama. NFT standards, cNFTs, custom candy machines, generating TypeScript clients from IDLs.",
    icon: "week-4-smiley.svg",
  },
  {
    week: "Week 5:",
    detail:
      "Indexing. Anchor events, Geyser/Yellowstone gRPC streams, real-time event listeners.",
    icon: "week-5-burst.svg",
  },
  {
    week: "Weeks 6–9:",
    detail: "Project-focused office hours.",
    icon: "weeks-6-9-symbol.svg",
  },
] as const;

export function SummerSchoolHero() {
  return (
    <section
      aria-labelledby="summer-school-title"
      className={`not-prose ${styles.canvas} ${styles.hero}`}
    >
      <Image
        src={`${figmaRoot}/hero/green-zigzag-backdrop.svg`}
        alt=""
        width={676}
        height={689}
        priority
        className={styles.heroArt}
        style={{ left: "-3%", top: "-13%", width: "45%", height: "78%" }}
      />
      <Image
        src={`${figmaRoot}/hero/tree-branch.webp`}
        alt="A tree branch woven through browser symbols"
        width={2000}
        height={2000}
        priority
        className={styles.heroArt}
        style={{ left: "-6%", top: "-7%", width: "46%", height: "61%" }}
      />
      <Image
        src={`${figmaRoot}/hero/cursor.webp`}
        alt=""
        width={287}
        height={326}
        priority
        className={styles.heroArt}
        style={{ left: "8%", top: "5%", width: "7%", height: "14%" }}
      />
      <Image
        src={`${figmaRoot}/hero/cursor.webp`}
        alt=""
        width={287}
        height={326}
        priority
        className={styles.heroArt}
        style={{
          left: "20%",
          top: "28%",
          width: "6%",
          height: "12%",
          transform: "rotate(22deg)",
        }}
      />
      <Image
        src={`${figmaRoot}/hero/rainbow-browser-orb.webp`}
        alt=""
        width={1564}
        height={1599}
        priority
        className={styles.heroArt}
        style={{ left: "3%", top: "24%", width: "4.2%", height: "8%" }}
      />
      <Image
        src={`${figmaRoot}/hero/rainbow-browser-orb.webp`}
        alt=""
        width={1564}
        height={1599}
        priority
        className={styles.heroArt}
        style={{ left: "27%", top: "10%", width: "4.2%", height: "8%" }}
      />
      <Image
        src={`${figmaRoot}/hero/volume-slider.webp`}
        alt="A volume slider collage"
        width={1227}
        height={379}
        priority
        className={styles.heroArt}
        style={{
          right: "3%",
          top: "17%",
          width: "27%",
          height: "11%",
          transform: "rotate(-16deg)",
        }}
      />
      <Image
        src={`${figmaRoot}/hero/mountain-strip.webp`}
        alt=""
        width={2451}
        height={629}
        priority
        className={styles.heroArt}
        style={{
          right: "-5%",
          top: "8%",
          width: "30%",
          height: "8%",
          transform: "rotate(-16deg)",
        }}
      />
      <Image
        src={`${figmaRoot}/hero/at-sign-orb.webp`}
        alt="At-sign sticker"
        width={816}
        height={817}
        priority
        className={styles.heroArt}
        style={{ right: "1%", top: "8%", width: "8%", height: "15%" }}
      />
      <Image
        src={`${figmaRoot}/hero/modem-head-backdrop.svg`}
        alt=""
        width={632}
        height={503}
        priority
        className={styles.heroArt}
        style={{ right: "-2%", bottom: "-8%", width: "38%", height: "54%" }}
      />
      <Image
        src={`${figmaRoot}/hero/modem-head.webp`}
        alt="A modem replacing a person's brain"
        width={860}
        height={688}
        priority
        className={styles.heroArt}
        style={{ right: "-2%", bottom: "-4%", width: "31%", height: "47%" }}
      />
      <div className={styles.heroTitle}>
        <Image
          src={`${figmaRoot}/hero/solana-logo.svg`}
          alt="Solana"
          width={646}
          height={96}
          priority
          className={styles.heroTitleLogo}
        />
        <h2 id="summer-school-title">
          <span className="sr-only">Summer School</span>
          <Image
            src={`${figmaRoot}/hero/summer-school-title.svg`}
            alt=""
            width={320}
            height={207}
            priority
            className={styles.heroTitleArt}
          />
        </h2>
      </div>
      <p className={styles.heroIntro}>
        Students from around the world.
        <br />
        Five weeks of classes.
        <br />
        Four weeks of capstones.
        <br />
        One demo day.
      </p>
      <p className={styles.heroDate}>
        June 15 – August 15
        <br />
        2026
      </p>
    </section>
  );
}

const numberStats = [
  ["1,164", "applicants"],
  ["69", "countries"],
  ["5", "weeks of live classes"],
  ["4", "weeks of capstone builds"],
  ["20", "teams presented at demo day"],
] as const;

export function SummerSchoolNumbers() {
  return (
    <section
      aria-labelledby="numbers-title"
      className={`not-prose ${styles.canvas} ${styles.numbers}`}
    >
      <h2
        id="numbers-title"
        className={`${styles.zineHeading} ${styles.numbersHeading}`}
      >
        The Numbers
      </h2>
      <Image
        src={`${figmaRoot}/numbers/world-map.svg`}
        alt="Hand-drawn world map"
        width={800}
        height={520}
        className={styles.numbersMap}
      />
      <Image
        src={`${figmaRoot}/numbers/map-arrows.svg`}
        alt=""
        width={780}
        height={501}
        className={styles.numbersArrows}
      />
      <Image
        src={`${figmaRoot}/numbers/solana-cassette.webp`}
        alt="Solana cassette illustration"
        width={193}
        height={195}
        className={styles.numbersSticker}
        style={{ left: "4.4%", top: "18.7%", width: "12.7%" }}
      />
      <Image
        src={`${figmaRoot}/numbers/payphone-globe.webp`}
        alt="Payphone and globe collage"
        width={268}
        height={223}
        className={styles.numbersSticker}
        style={{ left: "3.2%", top: "55.6%", width: "17.7%" }}
      />
      <Image
        src={`${figmaRoot}/numbers/dual-watch.webp`}
        alt="Futuristic wristwatch collage"
        width={214}
        height={198}
        className={styles.numbersSticker}
        style={{ right: "3.9%", top: "54.3%", width: "14.2%" }}
      />
      <Image
        src={`${figmaRoot}/numbers/compass.svg`}
        alt=""
        width={90}
        height={106}
        className={styles.numbersSticker}
        style={{ left: "5.5%", top: "44.2%", width: "6%" }}
      />
      <dl className={styles.numbersStats}>
        {numberStats.map(([value, label]) => (
          <div key={label}>
            <dd>{value}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SummerSchoolCurriculum() {
  return (
    <section
      aria-labelledby="curriculum-title"
      className={`not-prose ${styles.canvas} ${styles.curriculum}`}
    >
      <h2
        id="curriculum-title"
        className={`${styles.zineHeading} ${styles.curriculumHeading}`}
      >
        The
        <br />
        Curriculum
      </h2>
      <ol className={styles.curriculumGrid}>
        {curriculum.map(({ week, detail, icon }) => (
          <li key={week} className={styles.curriculumItem}>
            <Image
              src={`${figmaRoot}/curriculum/${icon}`}
              alt=""
              width={64}
              height={64}
            />
            <div>
              <h3>{week}</h3>
              <p>{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const lecturers = [
  {
    name: "Cat McGee",
    role: "Developer Relations Engineer · Solana Foundation",
    position: { left: "10.3%", top: "23.4%" },
    portrait: "cat-mcgee-front.webp",
  },
  {
    name: "Dev Bharel",
    role: "Developer Relations Engineer, AI · Solana Foundation",
    position: { left: "52.6%", top: "10.9%" },
    portrait: "dev-bharel-front.webp",
  },
  {
    name: "Dean Little",
    role: "Founder · Blueshift",
    position: { left: "10.3%", top: "48.5%" },
    portrait: "dean-little-front.webp",
  },
  {
    name: "Jacob Creech",
    role: "VP Technology · Solana Foundation",
    position: { left: "52.6%", top: "36%" },
    portrait: "jacob-creech-front.webp",
  },
  {
    name: "Chaerin Kim",
    role: "DevRel · Solana Foundation",
    position: { left: "10.3%", top: "71.8%" },
    portrait: "chaerin-kim-front.webp",
  },
  {
    name: "André Correia",
    role: "Head of DevRel · Solana Foundation",
    position: { left: "52.6%", top: "61.1%" },
    portrait: "andre-correia-front.webp",
  },
] as const;

export function SummerSchoolLecturers() {
  return (
    <section
      aria-labelledby="lecturers-title"
      className={`not-prose ${styles.canvas} ${styles.lecturers}`}
    >
      <h2
        id="lecturers-title"
        className={`${styles.zineHeading} ${styles.lecturersHeading}`}
      >
        Guest
        <br />
        Lecturers
      </h2>
      <Image
        src={`${figmaRoot}/lecturers/microphone.svg`}
        alt=""
        width={102}
        height={120}
        style={{
          position: "absolute",
          left: "32.5%",
          top: "8.2%",
          width: "6.75%",
        }}
      />
      {lecturers.map(({ name, role, position, portrait }) => (
        <article key={name} className={styles.lecturerCard} style={position}>
          <Image
            src={`${figmaRoot}/lecturers/name-cloud.svg`}
            alt=""
            width={332}
            height={154}
            className={styles.lecturerCloud}
          />
          <h3 className={styles.lecturerName}>{name}</h3>
          <p className={styles.lecturerRole}>{role}</p>
          <div className={styles.lecturerPortrait} aria-hidden="true">
            <Image
              src={`${figmaRoot}/lecturers/${portrait}`}
              alt=""
              width={312}
              height={312}
              loading="eager"
            />
          </div>
        </article>
      ))}
    </section>
  );
}

const nextSteps = [
  {
    title: "Solana School Fall Class",
    poster: "fall-class-poster.webp",
    frame: "fall-class-frame.svg",
  },
  {
    title: "University Ambassador Program",
    poster: "ambassador-program-poster.webp",
    frame: "ambassador-program-frame.svg",
  },
] as const;

export function SummerSchoolNextSteps() {
  return (
    <section
      aria-labelledby="next-title"
      className={`not-prose ${styles.canvas} ${styles.next}`}
    >
      <Image
        src={`${figmaRoot}/next/whats-next-circle.svg`}
        alt=""
        width={306}
        height={171}
        className={styles.nextCircle}
      />
      <h2
        id="next-title"
        className={`${styles.zineHeading} ${styles.nextHeading}`}
      >
        What’s
        <br />
        Next
      </h2>
      {nextSteps.map(({ title, poster, frame }) => (
        <article key={title} className={styles.nextCard}>
          <Image
            src={`${figmaRoot}/next/${frame}`}
            alt=""
            width={556}
            height={520}
            className={styles.nextFrame}
            loading="eager"
          />
          <Image
            src={`${figmaRoot}/next/${poster}`}
            alt=""
            width={800}
            height={800}
            className={styles.nextPoster}
            loading="eager"
          />
          <p className={styles.nextCardLabel}>{title}</p>
        </article>
      ))}
    </section>
  );
}
