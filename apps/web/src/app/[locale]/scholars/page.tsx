import type { Metadata } from "next";
import styles from "./scholars.module.css";

export const metadata: Metadata = {
  title: "Solana Scholars — Research Internships for PhD Students",
  description:
    "Solana Scholars offers focused research internships for PhD students — on-site or virtual — in close collaboration with Solana engineers. Apply now.",
};

export default function ScholarsPage() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          Call for applications · PhD students · Open year-round
        </p>
        <h1 className={styles.title}>
          Do research that <span className={styles.grad}>ships.</span>
        </h1>
        <p className={styles.authors}>
          Solana Scholars · Q. Kniep &amp; R. Wattenhofer
        </p>
        <div className={styles.abstract}>
          <span className={styles.abstractLabel}>Abstract</span>
          <p>
            Solana Scholars builds a bridge between Solana and the academic
            community. We fund focused research internships carried out in
            close collaboration with the people building the system. Your work
            doesn&apos;t end at a PDF. It ends up in production. We put the
            ship in internship.
          </p>
        </div>
        <div className={styles.heroCta}>
          <a className={styles.btn} href="/scholars/apply">
            Apply to the program
          </a>
          <span className={styles.note}>
            PhD students only · Rolling admissions
          </span>
        </div>
      </header>

      {/* §1 Why */}
      <section className={styles.section} id="program">
        <div className={styles.secHead}>
          <span className={styles.secNum}>§1</span>
          <h2>Why this program exists</h2>
        </div>
        <p className={styles.lede}>
          A lot of blockchain research never touches a real system, and a lot
          of real systems never benefit from research. We think that&apos;s a
          waste in both directions. Solana runs at a scale where open problems
          in consensus, networking, cryptography, and economics aren&apos;t
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
            <h3>Real problems</h3>
            <p>
              Internship topics come from what the system actually needs next —
              not from a grab bag of &quot;interesting directions.&quot;
            </p>
          </div>
          <div className={styles.cell}>
            <h3>Close collaboration</h3>
            <p>
              You work directly with Solana engineers and researchers
              throughout the internship, not just at kickoff and final report.
            </p>
          </div>
          <div className={styles.cell}>
            <h3>Publishable results</h3>
            <p>
              Internships are scoped so the outcome fits your PhD: papers,
              artifacts, and results you can build a thesis chapter on.
            </p>
          </div>
          <div className={styles.cell}>
            <h3>Impact you can point to</h3>
            <p>
              The best outcome of an internship is code, protocol changes, or
              analysis the ecosystem actually uses. That&apos;s the bar.
            </p>
          </div>
          <div className={styles.cell}>
            <h3>On-site or virtual</h3>
            <p>
              Join us in person — for example in Zurich, Switzerland or New
              York, USA — or work with us remotely from wherever your PhD
              keeps you.
            </p>
          </div>
          <div className={styles.cell}>
            <h3>Built around your PhD</h3>
            <p>
              Internships run for 3 months, with a possible extension. Timing
              is flexible and applications are open year-round, so it fits
              your program instead of interrupting it.
            </p>
          </div>
        </div>
      </section>

      {/* §2 How */}
      <section className={styles.section} id="how">
        <div className={styles.secHead}>
          <span className={styles.secNum}>§2</span>
          <h2>How it works</h2>
        </div>
        <ol className={styles.steps}>
          <li>
            <div>
              <h3>Apply with a direction</h3>
              <p>
                Tell us who you are, what you work on, and what you&apos;d want
                to tackle — pitch your own idea or express interest in one of
                our topic areas.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>Scope the internship together</h3>
              <p>
                If there&apos;s a fit, we define a small, focused internship
                with you: a concrete question, clear deliverables, a realistic
                timeline — and whether you&apos;ll join on-site or virtually.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>Research with us, not near us</h3>
              <p>
                The internship is funded, and you have regular working sessions
                with the Solana-side collaborators. When you&apos;re blocked,
                you know who to ask.
              </p>
            </div>
          </li>
          <li>
            <div>
              <h3>Ship the result</h3>
              <p>
                Publish the paper, release the artifact, present the findings —
                and see the work feed directly into the system.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* §3 Who */}
      <section className={styles.section} id="eligibility">
        <div className={styles.secHead}>
          <span className={styles.secNum}>§3</span>
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
          conferences in the area — at venues such as FC, AFT, PODC, DISC,
          SOSP, OSDI, EuroSys, SIGCOMM, NSDI, SIGMETRICS, CCS, S&amp;P, USENIX
          Security, NDSS, CRYPTO, EUROCRYPT, EC, or WINE.
        </p>
        <p className={styles.lede}>
          You&apos;re a great fit if you want your research to run against a
          real, live, planet-scale distributed system — and you&apos;re excited
          by the idea that a good result doesn&apos;t just get cited, it gets
          deployed.
        </p>
      </section>

      {/* §4 Apply */}
      <section className={styles.section} id="apply">
        <div className={styles.secHead}>
          <span className={styles.secNum}>§4</span>
          <h2>How to apply</h2>
        </div>
        <p className={styles.lede}>
          Applications are short — we care about your ideas and your fit, not
          paperwork. There is no application deadline: we accept applications
          throughout the year. Whenever you&apos;re ready, we&apos;re ready.
        </p>
        <div className={styles.heroCta}>
          <a className={styles.btn} href="/scholars/apply">
            Go to the application form
          </a>
          <span className={styles.note}>We read everything.</span>
        </div>
      </section>
    </main>
  );
}
