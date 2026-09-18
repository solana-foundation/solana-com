import Image from "next/image";
import styles from "./summer-school.module.css";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";
const figmaRoot = `${uploadRoot}/figma`;

const curriculum = [
  {
    week: "Week 1:",
    detail:
      "Intro to Solana. Architecture, transactions, PDAs, Rust, Anchor. First vault and escrow programs.",
    icon: "5c564.svg",
  },
  {
    week: "Week 2:",
    detail:
      "Token Extensions. Token 2022, transfer hooks, rate limits. Challenge: build a stablecoin.",
    icon: "3cecf.svg",
  },
  {
    week: "Week 3:",
    detail:
      "Pinocchio. Dropping Anchor for native Rust. Zero-copy patterns, compute unit optimization.",
    icon: "6c1ee.svg",
  },
  {
    week: "Week 4:",
    detail:
      "Metaplex & Codama. NFT standards, cNFTs, custom candy machines, generating TypeScript clients from IDLs.",
    icon: "5b54d.svg",
  },
  {
    week: "Week 5:",
    detail:
      "Indexing. Anchor events, Geyser/Yellowstone gRPC streams, real-time event listeners.",
    icon: "c3f79.svg",
  },
  {
    week: "Weeks 6–9:",
    detail: "Project-focused office hours.",
    icon: "923d6.svg",
  },
] as const;

export function SummerSchoolHero() {
  return (
    <section
      aria-labelledby="summer-school-title"
      className={`not-prose ${styles.canvas} ${styles.hero}`}
    >
      <Image
        src={`${figmaRoot}/hero/d4bbc.svg`}
        alt=""
        width={676}
        height={689}
        priority
        className={styles.heroArt}
        style={{ left: "-3%", top: "-13%", width: "45%", height: "78%" }}
      />
      <Image
        src={`${figmaRoot}/hero/ef80b.webp`}
        alt="A tree branch woven through browser symbols"
        width={2000}
        height={2000}
        priority
        className={styles.heroArt}
        style={{ left: "-6%", top: "-7%", width: "46%", height: "61%" }}
      />
      <Image
        src={`${figmaRoot}/hero/ab645.webp`}
        alt=""
        width={287}
        height={326}
        priority
        className={styles.heroArt}
        style={{ left: "8%", top: "5%", width: "7%", height: "14%" }}
      />
      <Image
        src={`${figmaRoot}/hero/ab645.webp`}
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
        src={`${figmaRoot}/hero/20ba1.webp`}
        alt=""
        width={1564}
        height={1599}
        priority
        className={styles.heroArt}
        style={{ left: "3%", top: "24%", width: "4.2%", height: "8%" }}
      />
      <Image
        src={`${figmaRoot}/hero/20ba1.webp`}
        alt=""
        width={1564}
        height={1599}
        priority
        className={styles.heroArt}
        style={{ left: "27%", top: "10%", width: "4.2%", height: "8%" }}
      />
      <Image
        src={`${figmaRoot}/hero/047f2.webp`}
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
        src={`${figmaRoot}/hero/10c18.webp`}
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
        src={`${figmaRoot}/hero/57498.webp`}
        alt="At-sign sticker"
        width={816}
        height={817}
        priority
        className={styles.heroArt}
        style={{ right: "1%", top: "8%", width: "8%", height: "15%" }}
      />
      <Image
        src={`${figmaRoot}/hero/9052c.svg`}
        alt=""
        width={632}
        height={503}
        priority
        className={styles.heroArt}
        style={{ right: "-2%", bottom: "-8%", width: "38%", height: "54%" }}
      />
      <Image
        src={`${figmaRoot}/hero/da4fa.webp`}
        alt="A modem replacing a person's brain"
        width={860}
        height={688}
        priority
        className={styles.heroArt}
        style={{ right: "-2%", bottom: "-4%", width: "31%", height: "47%" }}
      />
      <div className={styles.heroTitle}>
        <small>Solana</small>
        <h2 id="summer-school-title">Summer School</h2>
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
      <p className={styles.heroScroll}>⌁ Scroll</p>
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
        the Numbers
      </h2>
      <Image
        src={`${figmaRoot}/numbers/fa91e.svg`}
        alt="Hand-drawn world map"
        width={800}
        height={520}
        className={styles.numbersMap}
      />
      <Image
        src={`${figmaRoot}/numbers/95ad6.svg`}
        alt=""
        width={780}
        height={501}
        className={styles.numbersArrows}
      />
      <Image
        src={`${figmaRoot}/numbers/a027b.webp`}
        alt="Solana cassette illustration"
        width={193}
        height={195}
        className={styles.numbersSticker}
        style={{ left: "4.4%", top: "18.7%", width: "12.7%" }}
      />
      <Image
        src={`${figmaRoot}/numbers/b6895.webp`}
        alt="Payphone and globe collage"
        width={268}
        height={223}
        className={styles.numbersSticker}
        style={{ left: "3.2%", top: "55.6%", width: "17.7%" }}
      />
      <Image
        src={`${figmaRoot}/numbers/04e5a.webp`}
        alt="Futuristic wristwatch collage"
        width={214}
        height={198}
        className={styles.numbersSticker}
        style={{ right: "3.9%", top: "54.3%", width: "14.2%" }}
      />
      <Image
        src={`${figmaRoot}/numbers/f85c2.svg`}
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
        the
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
    layers: ["4bb51.webp", "6257f.webp", "3006a.webp"],
  },
  {
    name: "Dev Bharel",
    role: "Developer Relations Engineer, AI · Solana Foundation",
    position: { left: "52.6%", top: "10.9%" },
    layers: ["a2037.webp", "a2bdc.webp", "c90bb.webp"],
  },
  {
    name: "Dean Little",
    role: "Founder · Blueshift",
    position: { left: "10.3%", top: "48.5%" },
    layers: ["9bcf5.webp", "a6ebd.webp", "e4f9b.webp"],
  },
  {
    name: "Jacob Creech",
    role: "VP Technology · Solana Foundation",
    position: { left: "52.6%", top: "36%" },
    layers: ["78a09.webp", "d246c.webp", "97978.webp"],
  },
  {
    name: "Chaerin Kim",
    role: "DevRel · Solana Foundation",
    position: { left: "10.3%", top: "71.8%" },
    layers: ["70585.webp", "f856b.webp", "7110b.webp"],
  },
  {
    name: "André Correia",
    role: "Head of DevRel · Solana Foundation",
    position: { left: "52.6%", top: "61.1%" },
    layers: ["73943.webp", "fb495.webp", "05ffe.webp"],
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
        src={`${figmaRoot}/lecturers/a14b6.svg`}
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
      {lecturers.map(({ name, role, position, layers }) => (
        <article key={name} className={styles.lecturerCard} style={position}>
          <Image
            src={`${figmaRoot}/lecturers/61150.svg`}
            alt=""
            width={332}
            height={154}
            className={styles.lecturerCloud}
          />
          <h3 className={styles.lecturerName}>{name}</h3>
          <p className={styles.lecturerRole}>{role}</p>
          <div className={styles.lecturerPortrait} aria-hidden="true">
            {layers.map((asset) => (
              <Image
                key={asset}
                src={`${figmaRoot}/lecturers/${asset}`}
                alt=""
                width={312}
                height={312}
                loading="eager"
              />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

const nextSteps = [
  {
    title: "Solana School Fall Class",
    poster: "ce2e5.webp",
    frame: "0aa79.svg",
  },
  {
    title: "University Ambassador Program",
    poster: "fc81c.webp",
    frame: "27113.svg",
  },
] as const;

export function SummerSchoolNextSteps() {
  return (
    <section
      aria-labelledby="next-title"
      className={`not-prose ${styles.canvas} ${styles.next}`}
    >
      <Image
        src={`${figmaRoot}/next/4c5f1.svg`}
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
        <a
          key={title}
          href="https://solana.com/developers"
          className={styles.nextCard}
        >
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
        </a>
      ))}
    </section>
  );
}
