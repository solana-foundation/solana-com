import type { Metadata } from "next";
import {
  FileCheck2,
  Globe2,
  GraduationCap,
  Handshake,
  Rocket,
  Target,
} from "lucide-react";
import PixelBlast from "../../components/PixelBlast";
import SectionReveal from "./SectionReveal";
import styles from "./scholars.module.css";

export const metadata: Metadata = {
  title: "Solana Scholars — Research Internships for PhD Students",
  description:
    "Solana Scholars offers focused research internships for PhD students — on-site or virtual — in close collaboration with Solana engineers. Apply now.",
};

export default function ScholarsPage() {
  return (
    <main className={styles.page}>
      <SectionReveal />

      {/* Hero */}
      <header className={`${styles.hero} ${styles.heroProgram}`}>
        <PixelBlast
          className={styles.heroField}
          variant="circle"
          pixelSize={6}
          color="#0d9c68"
          patternScale={3}
          patternDensity={1.3}
          pixelSizeJitter={0.5}
          enableRipples={false}
          liquid={false}
          speed={0.5}
          edgeFade={0.28}
          transparent
        />
        <div className={`${styles.heroScrim} ${styles.heroScrimLeft}`} />
        <div className={`${styles.heroScrim} ${styles.heroScrimRight}`} />
        <div className={`${styles.heroScrim} ${styles.heroScrimBase}`} />

        <div className={styles.heroGrid}>
          <div>
            <p className={styles.eyebrow}>
              Call for applications · PhD students
            </p>
            <h1 className={styles.heroDisplay}>
              Do research
              <br />
              that <span className={styles.grad}>ships.</span>
            </h1>
            <p className={styles.authors}>
              Solana Scholars · Q. Kniep &amp; R. Wattenhofer
            </p>
          </div>
          <div>
            <div className={styles.abstractCard}>
              <span
                className={`${styles.abstractLabel} ${styles.abstractCardLabel}`}
              >
                Abstract
              </span>
              <p>
                Solana Scholars builds a bridge between Solana and the academic
                community. We fund focused research internships carried out in
                close collaboration with the people building the system. Your
                work doesn&apos;t end at a PDF. It ends up in production. We put
                the ship in internship.
              </p>
            </div>
            <div className={styles.heroCta}>
              <a
                className={styles.btn}
                href="https://solanafoundation.typeform.com/scholars"
              >
                Apply to the program
              </a>
              <span className={styles.note}>
                PhD students only · Rolling admissions
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Why */}
      <section className={styles.section} id="program" data-scholars-reveal>
        <div className={styles.secHead}>
          <h2>Why this program exists</h2>
        </div>
        <p className={styles.lede}>
          A lot of blockchain research never touches a real system, and a lot of
          real systems never benefit from research. We think that&apos;s a waste
          in both directions. Solana runs at a scale where open problems in
          consensus, networking, cryptography, and economics aren&apos;t
          hypothetical — they&apos;re on the roadmap.
        </p>
        <p className={styles.lede}>
          So we&apos;re offering scoped, well-defined 3-month research
          internships, pairing each scholar directly with the engineers and
          researchers working on those problems. Internships are on-site — for
          example in Zurich, Switzerland or New York, USA — or virtual. Every
          topic is chosen because we genuinely want the answer.
        </p>

        <div className={styles.grid}>
          <div className={styles.cell}>
            <Target aria-hidden="true" className={styles.cellIcon} />
            <h3>Real problems</h3>
            <p>
              Internship topics come from what the system actually needs next —
              not from a grab bag of &quot;interesting directions.&quot;
            </p>
          </div>
          <div className={styles.cell}>
            <Handshake aria-hidden="true" className={styles.cellIcon} />
            <h3>Close collaboration</h3>
            <p>
              You work directly with Solana engineers and researchers throughout
              the internship, not just at kickoff and final report.
            </p>
          </div>
          <div className={styles.cell}>
            <FileCheck2 aria-hidden="true" className={styles.cellIcon} />
            <h3>Publishable results</h3>
            <p>
              Internships are scoped so the outcome fits your PhD: papers,
              artifacts, and results you can build a thesis chapter on.
            </p>
          </div>
          <div className={styles.cell}>
            <Rocket aria-hidden="true" className={styles.cellIcon} />
            <h3>Impact you can point to</h3>
            <p>
              The best outcome of an internship is code, protocol changes, or
              analysis the ecosystem actually uses. That&apos;s the bar.
            </p>
          </div>
          <div className={styles.cell}>
            <Globe2 aria-hidden="true" className={styles.cellIcon} />
            <h3>On-site or virtual</h3>
            <p>
              Join us in person — for example in Zurich, Switzerland or New
              York, USA — or work with us remotely from wherever your PhD keeps
              you.
            </p>
          </div>
          <div className={styles.cell}>
            <GraduationCap aria-hidden="true" className={styles.cellIcon} />
            <h3>Built around your PhD</h3>
            <p>
              Internships run for 3 months, with a possible extension. Timing is
              flexible and applications are open year-round, so it fits your
              program instead of interrupting it.
            </p>
          </div>
        </div>
      </section>

      {/* Who */}
      <section className={styles.section} id="eligibility" data-scholars-reveal>
        <div className={styles.secHead}>
          <h2>Who can apply</h2>
        </div>
        <p className={styles.lede}>
          Right now, the program is open exclusively to{" "}
          <em>excellent PhD students</em>. If you&apos;re currently enrolled in
          a doctoral program and work in distributed systems, networking,
          cryptography, economics, or a neighboring field, we&apos;d love to
          hear from you.
        </p>
        <p className={styles.lede}>
          We expect candidates to have already published at scientific
          conferences in the area — at venues such as FC, AFT, PODC, DISC, SOSP,
          OSDI, EuroSys, SIGCOMM, NSDI, SIGMETRICS, CCS, S&amp;P, USENIX
          Security, NDSS, CRYPTO, EUROCRYPT, EC, or WINE.
        </p>
        <p className={styles.lede}>
          You&apos;re a great fit if you want your research to run against a
          real, live, planet-scale distributed system — and you&apos;re excited
          by the idea that a good result doesn&apos;t just get cited, it gets
          deployed.
        </p>
      </section>

      {/* Apply */}
      <section className={styles.section} id="apply" data-scholars-reveal>
        <div className={styles.secHead}>
          <h2>How to apply</h2>
        </div>
        <p className={styles.lede}>
          Applications are short — we care about your ideas and your fit, not
          paperwork. Pitch your own topic or express interest in one of our
          areas; if there&apos;s a fit, we scope the internship together. There
          is no application deadline: we accept applications throughout the
          year. Whenever you&apos;re ready, we&apos;re ready.
        </p>
        <div className={styles.heroCta}>
          <a
            className={styles.btn}
            href="https://solanafoundation.typeform.com/scholars"
          >
            Go to the application form
          </a>
        </div>
      </section>
    </main>
  );
}
