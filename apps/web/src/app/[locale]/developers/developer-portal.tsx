import type { ComponentType } from "react";
import { Link } from "@solana-com/ui-chrome/link";
import styles from "./developer-portal.module.scss";

type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

type StatCopy = {
  value: string;
  label: string;
  resource: string;
};

export type DeveloperPortalCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  whySolana: {
    eyebrow: string;
    title: string;
    description: string;
    stats: {
      transactions: StatCopy;
      fees: StatCopy;
      realWorldAssets: StatCopy;
    };
  };
  capitalMarkets: SectionCopy;
  speed: SectionCopy;
  ecosystem: SectionCopy;
  examples: SectionCopy;
  diagrams: {
    capitalMarkets: string;
    speed: string;
    ecosystem: string;
  };
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  );
}

function CapitalMarketsDiagram({ label }: { label: string }) {
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 640 420"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="capital-path-a" x1="70" y1="0" x2="570" y2="0">
          <stop stopColor="#7c5cff" />
          <stop offset=".5" stopColor="#58d9ff" />
          <stop offset="1" stopColor="#72f1b8" />
        </linearGradient>
        <linearGradient id="capital-path-b" x1="70" y1="0" x2="570" y2="0">
          <stop stopColor="#72f1b8" />
          <stop offset=".5" stopColor="#ffd166" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>

      <g className={styles.guideLines}>
        <path d="M72 72H568M72 210H568M72 348H568" />
        <path d="M120 48V372M320 48V372M520 48V372" />
      </g>

      <g className={styles.marketPaths}>
        <path
          className={styles.flowPath}
          d="M92 118C210 118 217 210 320 210s111-92 228-92"
          stroke="url(#capital-path-a)"
        />
        <path
          className={styles.flowPathReverse}
          d="M92 302c118 0 125-92 228-92s111 92 228 92"
          stroke="url(#capital-path-b)"
        />
        <path
          className={styles.flowPath}
          d="M92 210h456"
          stroke="url(#capital-path-a)"
        />
      </g>

      <g className={styles.marketNode}>
        <circle cx="92" cy="118" r="7" />
        <circle cx="92" cy="210" r="7" />
        <circle cx="92" cy="302" r="7" />
        <text x="72" y="96" textAnchor="start">
          MONEY
        </text>
        <text x="72" y="188" textAnchor="start">
          ASSETS
        </text>
        <text x="72" y="280" textAnchor="start">
          IDEAS
        </text>
      </g>

      <g className={styles.marketNode}>
        <circle cx="548" cy="118" r="7" />
        <circle cx="548" cy="210" r="7" />
        <circle cx="548" cy="302" r="7" />
        <text x="568" y="96" textAnchor="end">
          APPS
        </text>
        <text x="568" y="188" textAnchor="end">
          MARKETS
        </text>
        <text x="568" y="280" textAnchor="end">
          PEOPLE
        </text>
      </g>

      <g className={styles.marketCore}>
        <circle cx="320" cy="210" r="69" />
        <circle cx="320" cy="210" r="53" />
        <text x="320" y="204" textAnchor="middle">
          ONE OPEN
        </text>
        <text x="320" y="225" textAnchor="middle">
          NETWORK
        </text>
      </g>
    </svg>
  );
}

function SpeedDiagram({ label }: { label: string }) {
  const lanes = [112, 160, 208, 256, 304];

  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 640 420"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="speed-axis" x1="82" y1="0" x2="560" y2="0">
          <stop stopColor="#7c5cff" />
          <stop offset=".52" stopColor="#58d9ff" />
          <stop offset="1" stopColor="#72f1b8" />
        </linearGradient>
      </defs>

      <text className={styles.axisLabel} x="82" y="72">
        SEND
      </text>
      <text className={styles.axisLabel} x="320" y="72" textAnchor="middle">
        RUN TOGETHER
      </text>
      <text className={styles.axisLabel} x="558" y="72" textAnchor="end">
        SETTLED
      </text>

      <path className={styles.timeAxis} d="M82 344H566" />
      <path className={styles.timeArrow} d="m556 337 10 7-10 7" />
      <text className={styles.timeLabel} x="324" y="376" textAnchor="middle">
        TIME
      </text>

      {lanes.map((y, index) => (
        <g key={y}>
          <path
            className={styles.speedLane}
            d={`M92 ${y}H530`}
            style={{ opacity: 1 - index * 0.11 }}
          />
          <circle
            className={`${styles.speedPulse} ${styles[`speedPulse${index + 1}`]}`}
            cx="110"
            cy={y}
            r="7"
          />
          <circle className={styles.laneEnd} cx="530" cy={y} r="4" />
        </g>
      ))}

      <path className={styles.settleLine} d="M530 96V320" />
      <circle className={styles.settleRing} cx="530" cy="208" r="32" />
      <circle className={styles.settlePoint} cx="530" cy="208" r="8" />
    </svg>
  );
}

function EcosystemDiagram({ label }: { label: string }) {
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 640 420"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="ecosystem-ring" x1="120" y1="70" x2="520" y2="350">
          <stop stopColor="#7c5cff" />
          <stop offset=".5" stopColor="#58d9ff" />
          <stop offset="1" stopColor="#72f1b8" />
        </linearGradient>
      </defs>

      <circle className={styles.ecosystemOrbit} cx="320" cy="210" r="142" />
      <circle className={styles.ecosystemOrbitInner} cx="320" cy="210" r="88" />

      <g className={styles.ecosystemConnections}>
        <path d="M320 210 320 68M320 210 443 139M320 210 443 281M320 210 320 352M320 210 197 281M320 210 197 139" />
      </g>

      <g className={styles.ecosystemCore}>
        <circle cx="320" cy="210" r="58" />
        <text x="320" y="205" textAnchor="middle">
          YOUR
        </text>
        <text x="320" y="228" textAnchor="middle">
          APP
        </text>
      </g>

      <g className={styles.ecosystemNode}>
        <circle cx="320" cy="68" r="11" />
        <text x="320" y="39" textAnchor="middle">
          WALLETS
        </text>
      </g>
      <g className={styles.ecosystemNode}>
        <circle cx="443" cy="139" r="11" />
        <text x="474" y="126">
          TOKENS
        </text>
      </g>
      <g className={styles.ecosystemNode}>
        <circle cx="443" cy="281" r="11" />
        <text x="474" y="300">
          MARKETS
        </text>
      </g>
      <g className={styles.ecosystemNode}>
        <circle cx="320" cy="352" r="11" />
        <text x="320" y="390" textAnchor="middle">
          TOOLS
        </text>
      </g>
      <g className={styles.ecosystemNode}>
        <circle cx="197" cy="281" r="11" />
        <text x="166" y="300" textAnchor="end">
          PAYMENTS
        </text>
      </g>
      <g className={styles.ecosystemNode}>
        <circle cx="197" cy="139" r="11" />
        <text x="166" y="126" textAnchor="end">
          PEOPLE
        </text>
      </g>
    </svg>
  );
}

function ConceptSection({
  copy,
  href,
  Diagram,
  diagramLabel,
  reverse = false,
}: {
  copy: SectionCopy;
  href: string;
  Diagram: ComponentType<{ label: string }>;
  diagramLabel: string;
  reverse?: boolean;
}) {
  return (
    <section
      className={`${styles.concept} ${reverse ? styles.conceptReverse : ""}`}
    >
      <div className={styles.conceptCopy}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p className={styles.description}>{copy.description}</p>
        <Link to={href} className={styles.textLink}>
          {copy.cta}
          <Arrow />
        </Link>
      </div>
      <div className={styles.diagramFrame}>
        <Diagram label={diagramLabel} />
      </div>
    </section>
  );
}

export function DeveloperPortal({ copy }: { copy: DeveloperPortalCopy }) {
  const stats = [
    {
      ...copy.whySolana.stats.transactions,
      href: "/data",
    },
    {
      ...copy.whySolana.stats.fees,
      href: "/docs/core/fees",
    },
    {
      ...copy.whySolana.stats.realWorldAssets,
      href: "/news/solana-ecosystem-roundup-june-2026",
    },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroOrbit} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.shell}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className={styles.heroDescription}>{copy.hero.description}</p>
            <div className={styles.heroActions}>
              <Link to="/docs" className={styles.primaryButton}>
                {copy.hero.primaryCta}
                <Arrow />
              </Link>
              <Link to="/docs/payments" className={styles.secondaryButton}>
                {copy.hero.secondaryCta}
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.shell}>
        <section className={styles.whySolana}>
          <div className={styles.whySolanaIntro}>
            <p className={styles.eyebrow}>{copy.whySolana.eyebrow}</p>
            <h2>{copy.whySolana.title}</h2>
            <p>{copy.whySolana.description}</p>
          </div>

          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <Link key={stat.label} to={stat.href} className={styles.stat}>
                <span className={styles.statIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{stat.value}</strong>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statResource}>
                  {stat.resource}
                  <Arrow />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.concepts}>
          <ConceptSection
            copy={copy.capitalMarkets}
            href="/docs/finance"
            Diagram={CapitalMarketsDiagram}
            diagramLabel={copy.diagrams.capitalMarkets}
          />
          <ConceptSection
            copy={copy.speed}
            href="/docs/core/transactions"
            Diagram={SpeedDiagram}
            diagramLabel={copy.diagrams.speed}
            reverse
          />
          <ConceptSection
            copy={copy.ecosystem}
            href="/docs/clients"
            Diagram={EcosystemDiagram}
            diagramLabel={copy.diagrams.ecosystem}
          />
        </div>

        <section className={styles.examples}>
          <div>
            <p className={styles.eyebrow}>{copy.examples.eyebrow}</p>
            <h2>{copy.examples.title}</h2>
            <p>{copy.examples.description}</p>
          </div>
          <Link to="/developers/templates" className={styles.examplesButton}>
            {copy.examples.cta}
            <Arrow />
          </Link>
        </section>
      </div>
    </main>
  );
}
