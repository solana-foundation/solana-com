import { Checklist } from "@boxicons/react/Checklist";
import { Globe } from "@boxicons/react/Globe";
import { Handshake } from "@boxicons/react/Handshake";
import { Rocket } from "@boxicons/react/Rocket";
import { School } from "@boxicons/react/School";
import { Target } from "@boxicons/react/Target";
import PixelBlast from "../../components/PixelBlast";
import SectionReveal from "./SectionReveal";
import { getIndexMetadata } from "@/app/metadata";

// Keep the route's utility groups together while the surrounding page markup
// continues to use the same class names and reveal state hooks.
const styles = {
  page: "min-h-full overflow-hidden bg-black font-brand font-normal leading-normal text-white antialiased [&_:is(h1,h2,h3,p,ol)]:mb-0",
  hero: "mx-auto box-border flex w-full max-w-[1440px] flex-col items-start border-b border-nd-border-light bg-black px-10 pb-[88px] pt-[120px] text-left max-[900px]:px-6 max-[900px]:pb-[72px] max-[900px]:pt-24 max-[640px]:px-5 max-[640px]:pb-14 max-[640px]:pt-[72px]",
  heroProgram:
    "relative min-h-[680px] items-end justify-end overflow-hidden pt-[132px] max-[1279px]:min-h-0",
  heroField:
    "pointer-events-none !absolute inset-0 z-0 opacity-0 transition-opacity duration-[900ms] [transition-timing-function:cubic-bezier(0.16,0.84,0.34,1)] data-[pixel-blast-state=ready]:opacity-100 data-[pixel-blast-state=fallback]:bg-[radial-gradient(70%_70%_at_62%_45%,rgb(20_241_149_/_0.1),transparent_70%)] data-[pixel-blast-state=fallback]:opacity-100 motion-reduce:!transition-none",
  heroScrim: "pointer-events-none absolute inset-0 z-[1]",
  heroScrimLeft:
    "bg-[linear-gradient(100deg,rgb(0_0_0_/_0.96)_0%,rgb(0_0_0_/_0.9)_28%,rgb(0_0_0_/_0.46)_52%,rgb(0_0_0_/_0.14)_72%,transparent_86%)]",
  heroScrimRight:
    "bg-[linear-gradient(270deg,rgb(0_0_0_/_0.72)_0%,rgb(0_0_0_/_0.4)_16%,transparent_38%)]",
  heroScrimBase:
    "bg-[linear-gradient(to_bottom,rgb(0_0_0_/_0.5)_0%,transparent_22%,transparent_64%,rgb(0_0_0_/_0.86)_100%)]",
  heroGrid:
    "relative z-[2] grid w-full grid-cols-[minmax(0,1.37fr)_minmax(540px,1fr)] items-stretch gap-16 [&>div]:min-w-0 [&>div:first-child]:flex [&>div:first-child]:flex-col [&>div:first-child]:justify-center [&>div>*]:animate-scholars-rise [&>div>*:nth-child(1)]:[animation-delay:40ms] [&>div>*:nth-child(2)]:[animation-delay:110ms] [&>div>*:nth-child(3)]:[animation-delay:200ms] motion-reduce:[&>div>*]:!animate-none max-[1279px]:grid-cols-1 max-[1279px]:gap-12",
  eyebrow:
    "font-['ABC_Diatype_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium uppercase leading-4 tracking-[0.9px] text-solana-green",
  heroDisplay:
    "mt-7 text-[clamp(56px,8.6vw,124px)] font-medium leading-[0.92] tracking-[-0.04em]",
  grad: "font-light text-solana-green",
  authors: "mt-6 text-base leading-6 text-nd-mid-em-text",
  abstractCard:
    "relative block max-w-none border border-nd-border-prominent bg-[linear-gradient(to_bottom,rgb(0_0_0_/_0.74),rgb(0_0_0_/_0.52))] px-7 pb-7 pt-[26px] backdrop-blur-[10px] [&_p]:text-[19px] [&_p]:leading-7 [&_p]:tracking-[-0.01em] [&_p]:text-nd-mid-em-text",
  abstractLabel:
    "font-['ABC_Diatype_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium uppercase leading-4 tracking-[0.9px] text-white",
  abstractCardLabel: "mb-4 block",
  heroCta: "col-start-2 flex flex-wrap items-center max-[900px]:col-start-1",
  btn: "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-transparent bg-white px-6 py-[10px] text-lg font-medium leading-6 tracking-[-0.01em] text-black no-underline transition-opacity duration-150 hover:opacity-[0.84] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-solana-green motion-reduce:transition-none",
  note: "font-['ABC_Diatype_Mono',ui-monospace,SFMono-Regular,Menlo,monospace] text-xs font-medium uppercase leading-4 tracking-[0.9px] text-nd-mid-em-text",
  section:
    "mx-auto box-border grid w-full max-w-[1440px] grid-cols-[minmax(180px,0.56fr)_minmax(0,1.44fr)] gap-16 border-b border-nd-border-light px-10 py-[120px] [&[data-reveal-state]>*]:transition-[opacity,transform] [&[data-reveal-state]>*]:[transition-duration:760ms] [&[data-reveal-state]>*]:[transition-timing-function:cubic-bezier(0.16,0.84,0.34,1)] [&[data-reveal-state=pending]>*]:translate-y-[14px] [&[data-reveal-state=pending]>*]:opacity-0 [&[data-reveal-state=visible]>*]:translate-y-0 [&[data-reveal-state=visible]>*]:opacity-100 [&[data-reveal-state]>:nth-child(2)]:[transition-delay:60ms] [&[data-reveal-state]>:nth-child(3)]:[transition-delay:120ms] [&[data-reveal-state]>:nth-child(4)]:[transition-delay:180ms] motion-reduce:[&[data-reveal-state]>*]:transform-none motion-reduce:[&[data-reveal-state]>*]:transition-none max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[900px]:px-6 max-[900px]:py-20 max-[640px]:px-5 max-[640px]:py-16",
  secHead:
    "flex flex-col items-start gap-5 [&_h2]:max-w-[360px] [&_h2]:text-[clamp(32px,3vw,48px)] [&_h2]:font-medium [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.03em]",
  lede: "col-start-2 max-w-[680px] text-xl leading-7 tracking-[-0.01em] text-nd-mid-em-text [&+&]:-mt-[38px] [&_em]:not-italic [&_em]:text-white max-[900px]:col-start-1 max-[640px]:text-lg max-[640px]:leading-[26px]",
  grid: "col-start-2 mt-4 grid grid-cols-3 border-l border-t border-nd-border-light max-[900px]:col-start-1 max-[640px]:grid-cols-1",
  cell: "min-h-[236px] border-b border-r border-nd-border-light p-7 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:leading-7 [&_h3]:tracking-[-0.01em] [&_p]:mt-3 [&_p]:text-base [&_p]:leading-6 [&_p]:text-nd-mid-em-text max-[640px]:min-h-0 max-[640px]:p-6",
  cellIcon: "mb-11 block size-6 text-solana-green max-[640px]:mb-7",
} as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "scholars.title",
    descriptionKey: "scholars.description",
    path: "/scholars",
    locale,
  });
}

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
            <div
              className={`${styles.heroCta} mt-12 flex-nowrap gap-4 max-[640px]:flex-wrap [&_span]:whitespace-nowrap`}
            >
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
            <Checklist aria-hidden="true" className={styles.cellIcon} />
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
            <Globe aria-hidden="true" className={styles.cellIcon} />
            <h3>On-site or virtual</h3>
            <p>
              Join us in person — for example in Zurich, Switzerland or New
              York, USA — or work with us remotely from wherever your PhD keeps
              you.
            </p>
          </div>
          <div className={styles.cell}>
            <School aria-hidden="true" className={styles.cellIcon} />
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
