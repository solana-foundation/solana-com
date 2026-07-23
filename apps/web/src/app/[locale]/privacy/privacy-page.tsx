"use client";

import { SelectionColor } from "@/component-library/selection-color";
import { ECOSYSTEM_PROJECTS } from "@/data/solutions/privacy";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { DotField, LiveFeed } from "./privacy-animations";

interface UseCaseItem {
  title: string;
  description: string;
  privacyType: string;
}

interface QuadrantData {
  title: string;
  description: string;
  items?: string[];
}

interface PrivacyPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    heroSupportingText: string;
    spectrumTitle: string;
    spectrumDescription: string;
    pseudonymity: QuadrantData;
    anonymity: QuadrantData;
    confidentiality: QuadrantData;
    fullyPrivate: QuadrantData;
    principlesTitle: string;
    principle1Title: string;
    principle1Description: string;
    principle2Title: string;
    principle2Description: string;
    principle3Title: string;
    principle3Description: string;
    ecosystemTitle: string;
    useCasesTitle: string;
    useCasesDescription: string;
    useCasesList: UseCaseItem[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    ctaButtonHref: string;
  };
}

const PROJECT_PRIVACY_TYPES: Record<string, string> = {
  arcane: "confidential",
  contra: "fullyPrivate",
  encrypt: "fullyPrivate",
  heliusPrivacyProtocol: "fullyPrivate",
  privacyCash: "anonymous",
  encifher: "confidential",
  ligero: "confidential",
  magicBlock: "fullyPrivate",
  lightProtocol: "anonymous",
  arcium: "fullyPrivate",
  inco: "fullyPrivate",
  confidentialTransfer: "confidential",
};

const BADGE_FOR_TYPE: Record<string, { className: string; label: string }> = {
  fullyPrivate: { className: "pp-badge pp-fully", label: "Fully Private" },
  anonymous: { className: "pp-badge pp-anon", label: "Anonymous" },
  confidential: { className: "pp-badge pp-conf", label: "Confidential" },
  pseudonymous: { className: "pp-badge pp-anon", label: "Pseudonymous" },
};

const PROJECT_META_TAGS: Record<string, string> = {
  arcane: "FIN",
  arcium: "MPC",
  contra: "E2E",
  encifher: "DEFI",
  encrypt: "INFRA",
  heliusPrivacyProtocol: "ZK",
  inco: "FHE",
  ligero: "ZK",
  lightProtocol: "ZK",
  magicBlock: "GAME",
  privacyCash: "TX",
  confidentialTransfer: "CT-EXT",
};

function splitTitle(raw: string, italicWordCount = 1) {
  const stripped = raw.replace(/[.!?]+$/, "").trim();
  const words = stripped.split(/\s+/);
  if (words.length <= italicWordCount) {
    return { head: "", tail: stripped + "." };
  }
  const head = words.slice(0, words.length - italicWordCount).join(" ");
  const tail = words.slice(-italicWordCount).join(" ") + ".";
  return { head, tail };
}

const ARROW_ICON = (
  <svg
    className="pp-arrow"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

const QUADRANT_ICONS = {
  pseudonymity: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  anonymity: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z" />
    </svg>
  ),
  confidentiality: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  fullyPrivate: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
};

/* ──────────────────────────────────────────────────────────
   Section pieces
   ────────────────────────────────────────────────────────── */

function Hero({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  const heroTitle = translations.heroTitle;
  const splitIndex = heroTitle.indexOf(" ");
  const row1Text = splitIndex >= 0 ? heroTitle.slice(0, splitIndex) : heroTitle;
  const row2Text =
    splitIndex >= 0
      ? heroTitle.slice(splitIndex + 1).replace(/[.!?]+$/, "")
      : "";
  return (
    <section className="pp-hero">
      <div className="pp-hero-bg" aria-hidden="true" />
      <div className="pp-hero-grid" aria-hidden="true" />
      <DotField />

      <div className="pp-hero-frame">
        <div className="pp-rail" aria-hidden="true">
          <div className="pp-crosshair" />
          <div className="pp-vtext">SOL · PRIVACY · DOC // 04 · 2026</div>
          <div className="pp-crosshair" />
        </div>

        <div className="pp-hero-main">
          <div className="pp-hero-meta">
            <span className="pp-pill">
              <span className="pp-dot" /> SIGNAL · LIVE
            </span>
            <span>FILE&nbsp;//&nbsp;PRIVACY.SOL</span>
            <span style={{ marginLeft: "auto", color: "var(--pp-ink-faint)" }}>
              PG&nbsp;01&nbsp;/&nbsp;06
            </span>
          </div>

          <h1 className="pp-hero-title">
            <span className="pp-row1">{row1Text}</span>
            {row2Text && (
              <span className="pp-row2">
                <span className="pp-name">{row2Text}</span>
                <span className="pp-period">.</span>
              </span>
            )}
          </h1>

          <p className="pp-hero-sub">{translations.heroSubtitle}</p>

          <div className="pp-hero-cta-row">
            <a className="pp-btn pp-btn-primary" href="#spectrum">
              {translations.heroSupportingText}
              {ARROW_ICON}
            </a>
            <span
              className="pp-mono"
              style={{
                marginLeft: "auto",
                color: "var(--pp-ink-faint)",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              v.2026.04 · MAINNET
            </span>
          </div>
        </div>

        <aside className="pp-hero-side">
          <div className="pp-panel-h">
            <span>Privacy Levels</span>
            <span>04</span>
          </div>
          <div>
            <div className="pp-lvl-row">
              <span className="pp-num">01</span>
              <span className="pp-lvl-name">
                {translations.pseudonymity.title}
              </span>
              <span className="pp-tag">DEFAULT</span>
            </div>
            <div className="pp-lvl-row">
              <span className="pp-num">02</span>
              <span className="pp-lvl-name">
                {translations.anonymity.title}
              </span>
              <span className="pp-tag">ZK</span>
            </div>
            <div className="pp-lvl-row">
              <span className="pp-num">03</span>
              <span className="pp-lvl-name">
                {translations.confidentiality.title}
              </span>
              <span className="pp-tag">CT-EXT</span>
            </div>
            <div className="pp-lvl-row">
              <span className="pp-num">04</span>
              <span className="pp-lvl-name">
                {translations.fullyPrivate.title}
              </span>
              <span className="pp-tag">MPC · FHE</span>
            </div>
          </div>

          <div className="pp-panel-h" style={{ marginTop: 8 }}>
            <span>Network · Live</span>
            <span style={{ color: "var(--pp-green)" }}>●</span>
          </div>
          <LiveFeed />
        </aside>
      </div>
    </section>
  );
}

function Spectrum({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  const q1 = translations.pseudonymity;
  const q2 = translations.anonymity;
  const q3 = translations.confidentiality;
  const q4 = translations.fullyPrivate;

  const renderItems = (items?: string[]) =>
    items && items.length > 0 ? (
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <span className="pp-arr">→</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <section id="spectrum" className="pp-section-pad">
      <div className="pp-container">
        <div className="pp-section-head">
          <div className="pp-section-num pp-mono">
            <strong>§ 02</strong>
            <br />
            —— 06
          </div>
          <div>
            <div className="pp-section-tag pp-mono">privacy_spectrum</div>
            {(() => {
              const { head, tail } = splitTitle(translations.spectrumTitle);
              return (
                <h2 className="pp-section-title">
                  {head} <em>{tail}</em>
                </h2>
              );
            })()}
            <p className="pp-section-lead">
              {translations.spectrumDescription}
            </p>
          </div>
        </div>

        <div className="pp-spectrum-wrap">
          <span className="pp-corner-tl" />
          <span className="pp-corner-tr" />
          <span className="pp-corner-bl" />
          <span className="pp-corner-br" />

          <div className="pp-axes-header">
            <div className="pp-col">AXES</div>
            <div className="pp-col">
              <span className="pp-arrow-l" /> IDENTITY VISIBLE
            </div>
            <div className="pp-col">
              <span className="pp-arrow-l" /> IDENTITY HIDDEN
            </div>
          </div>

          <div className="pp-quad-grid">
            <div className="pp-row-label">DATA · VISIBLE</div>

            <div className="pp-quad" data-c="q1">
              <span className="pp-accent" />
              <div className="pp-head">
                <div className="pp-q-name">
                  <span className="pp-ico">{QUADRANT_ICONS.pseudonymity}</span>
                  {q1.title}
                </div>
                <span className="pp-lvl">LV. 01</span>
              </div>
              <p className="pp-body">{q1.description}</p>
              {renderItems(q1.items)}
            </div>

            <div className="pp-quad" data-c="q2">
              <span className="pp-accent" />
              <div className="pp-head">
                <div className="pp-q-name">
                  <span className="pp-ico">{QUADRANT_ICONS.anonymity}</span>
                  {q2.title}
                </div>
                <span className="pp-lvl">LV. 02</span>
              </div>
              <p className="pp-body">{q2.description}</p>
              {renderItems(q2.items)}
            </div>

            <div className="pp-row-label">DATA · HIDDEN</div>

            <div className="pp-quad" data-c="q3">
              <span className="pp-accent" />
              <div className="pp-head">
                <div className="pp-q-name">
                  <span className="pp-ico">
                    {QUADRANT_ICONS.confidentiality}
                  </span>
                  {q3.title}
                </div>
                <span className="pp-lvl">LV. 03</span>
              </div>
              <p className="pp-body">{q3.description}</p>
              {renderItems(q3.items)}
            </div>

            <div className="pp-quad" data-c="q4">
              <span className="pp-accent" />
              <div className="pp-head">
                <div className="pp-q-name">
                  <span className="pp-ico">{QUADRANT_ICONS.fullyPrivate}</span>
                  {q4.title}
                </div>
                <span className="pp-lvl">LV. 04</span>
              </div>
              <p className="pp-body">{q4.description}</p>
              {renderItems(q4.items)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Principles({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  const rows = [
    {
      title: translations.principle1Title,
      description: translations.principle1Description,
      aside: [
        ["composable", "true"],
        ["scope", "per-app"],
        ["opt-in", "default"],
      ],
    },
    {
      title: translations.principle2Title,
      description: translations.principle2Description,
      aside: [
        ["zk-proof", "native"],
        ["audit", "selective"],
        ["disclosure", "opt-in"],
      ],
    },
    {
      title: translations.principle3Title,
      description: translations.principle3Description,
      aside: [
        ["slot", "400ms"],
        ["tps", "high"],
        ["fees", "low"],
      ],
    },
  ];

  return (
    <section className="pp-principles">
      <div
        className="pp-container"
        style={{ paddingTop: 96, paddingBottom: 96 }}
      >
        <div className="pp-section-head">
          <div className="pp-section-num pp-mono">
            <strong>§ 03</strong>
            <br />
            —— 06
          </div>
          <div>
            <div className="pp-section-tag pp-mono">design_principles</div>
            {(() => {
              const { head, tail } = splitTitle(translations.principlesTitle);
              return (
                <h2 className="pp-section-title">
                  {head} <em>{tail}</em>
                </h2>
              );
            })()}
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          {rows.map((row, i) => (
            <div className="pp-principle-row" key={i}>
              <div className="pp-principle-num">
                {String(i + 1).padStart(2, "0")}
                <span className="pp-slash">/</span>
              </div>
              <div>
                <h3 className="pp-principle-title">{row.title}</h3>
                <p className="pp-principle-body">{row.description}</p>
              </div>
              <div className="pp-principle-aside">
                <div>
                  <span className="pp-swatch" />
                  <span className="pp-k">principle </span>
                  <span className="pp-v">
                    {`// ${String(i + 1).padStart(2, "0")}`}
                  </span>
                </div>
                <hr className="pp-hr-dashed" />
                {row.aside.map(([k, v]) => (
                  <div key={k}>
                    <span className="pp-k">{k}</span>{" "}
                    <span className="pp-v">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = (
    <span className="pp-ticker-item">
      Confidential&nbsp;Tokens<span className="pp-star">✦</span>
      <em>Light&nbsp;Protocol</em>
      <span className="pp-star">✦</span>
      Arcium&nbsp;MPC<span className="pp-star">✦</span>
      <em>Encrypted&nbsp;Identity</em>
      <span className="pp-star">✦</span>
      Private&nbsp;DAO<span className="pp-star">✦</span>
      <em>Helius&nbsp;Privacy</em>
      <span className="pp-star">✦</span>
      Arcane<span className="pp-star">✦</span>
      <em>Ligero&nbsp;ZK</em>
      <span className="pp-star">✦</span>
    </span>
  );

  return (
    <div className="pp-ticker" aria-hidden="true">
      <div className="pp-ticker-track">
        {items}
        {items}
      </div>
    </div>
  );
}

function Ecosystem({ title }: { title: string }) {
  const t = useTranslations();
  return (
    <section className="pp-section-pad" style={{ paddingTop: 96 }}>
      <div className="pp-container">
        <div className="pp-section-head">
          <div className="pp-section-num pp-mono">
            <strong>§ 04</strong>
            <br />
            —— 06
          </div>
          <div>
            <div className="pp-section-tag pp-mono">ecosystem</div>
            {(() => {
              const { head, tail } = splitTitle(title, 2);
              return (
                <h2 className="pp-section-title">
                  {head} <em>{tail}</em>
                </h2>
              );
            })()}
          </div>
        </div>

        <div className="pp-eco-grid">
          {ECOSYSTEM_PROJECTS.map(({ key, href }, index) => {
            const projectTitle = t(`privacy.ecosystem.${key}.title`);
            const projectDescription = t(
              `privacy.ecosystem.${key}.description`,
            );
            const privacyType = PROJECT_PRIVACY_TYPES[key] ?? "anonymous";
            const badge =
              BADGE_FOR_TYPE[privacyType] ?? BADGE_FOR_TYPE.anonymous;
            const mark = projectTitle.charAt(0).toUpperCase();
            const meta = PROJECT_META_TAGS[key] ?? "";

            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="pp-eco-card"
              >
                <div className="pp-top">
                  <div className="pp-eco-name">
                    <span className="pp-eco-mark">{mark}</span>
                    {projectTitle}
                  </div>
                  <span className={badge.className}>{badge.label}</span>
                </div>
                <p>{projectDescription}</p>
                <div className="pp-meta">
                  <span>{`// ${String(index + 1).padStart(2, "0")}`}</span>
                  {meta && <span>{meta}</span>}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const BENTO_SLOTS: Array<{
  cls: string;
  c: "q2" | "q4";
  label: string;
  titleSize?: number;
}> = [
  { cls: "pp-priv-pay", c: "q2", label: "CONFIDENTIAL · 01", titleSize: 34 },
  { cls: "pp-priv-trade", c: "q2", label: "CONFIDENTIAL · 02" },
  { cls: "pp-payroll", c: "q2", label: "CONF · 03", titleSize: 22 },
  { cls: "pp-dao", c: "q4", label: "ANONYMOUS · 04" },
  { cls: "pp-identity", c: "q4", label: "ANONYMOUS · 05" },
  { cls: "pp-ai", c: "q4", label: "FULLY PRIVATE · 06" },
];

function BentoFigure({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="pp-figs">
          <div
            className="pp-mono"
            style={{
              color: "var(--pp-ink-faint)",
              fontSize: 11,
              lineHeight: 1.7,
            }}
          >
            <div>tx&nbsp;&nbsp;&nbsp; ▸ 0x••••3f</div>
            <div>
              from ▸{" "}
              <span style={{ color: "var(--pp-ink-dim)" }}>aL71…ke9</span>
            </div>
            <div>
              to&nbsp;&nbsp;&nbsp; ▸{" "}
              <span style={{ color: "var(--pp-ink-dim)" }}>m3Vp…q8x</span>
            </div>
            <div>
              amt&nbsp; ▸{" "}
              <span className="pp-redact-line" style={{ width: 60 }} />{" "}
              <span style={{ color: "var(--pp-q2)" }}>USDC</span>
            </div>
          </div>
          <svg
            width="120"
            height="64"
            viewBox="0 0 120 64"
            fill="none"
            style={{ marginLeft: "auto" }}
            aria-hidden="true"
          >
            <path
              d="M5 50 L25 30 L45 38 L65 18 L85 28 L115 12"
              stroke="var(--pp-green)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M5 50 L25 30 L45 38 L65 18 L85 28 L115 12"
              stroke="var(--pp-green)"
              strokeWidth="6"
              fill="none"
              opacity=".15"
            />
          </svg>
        </div>
      );
    case 1:
      return (
        <div
          className="pp-mono"
          style={{
            color: "var(--pp-ink-faint)",
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          order ▸ #0xab&nbsp;&nbsp; side ▸{" "}
          <span className="pp-redact-line" style={{ width: 30 }} />
          <br />
          size&nbsp; ▸ <span className="pp-redact-line" style={{ width: 50 }} />
          &nbsp;&nbsp; fill ▸{" "}
          <span className="pp-redact-line" style={{ width: 30 }} />
        </div>
      );
    case 3:
      return (
        <>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 14,
              alignItems: "center",
            }}
          >
            <div
              className="pp-mono"
              style={{
                fontSize: 10,
                color: "var(--pp-ink-faint)",
                minWidth: 24,
              }}
            >
              FOR
            </div>
            <div
              style={{
                flex: 1,
                height: 6,
                background: "rgba(255,255,255,.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "62%",
                  background: "var(--pp-purple)",
                  boxShadow: "0 0 12px var(--pp-purple)",
                }}
              />
            </div>
            <div
              className="pp-mono"
              style={{ fontSize: 10, color: "var(--pp-ink-dim)" }}
            >
              ▒▒%
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 6,
              alignItems: "center",
            }}
          >
            <div
              className="pp-mono"
              style={{
                fontSize: 10,
                color: "var(--pp-ink-faint)",
                minWidth: 24,
              }}
            >
              AGN
            </div>
            <div
              style={{
                flex: 1,
                height: 6,
                background: "rgba(255,255,255,.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "30%",
                  background: "#a1a1aa",
                }}
              />
            </div>
            <div
              className="pp-mono"
              style={{ fontSize: 10, color: "var(--pp-ink-dim)" }}
            >
              ▒▒%
            </div>
          </div>
        </>
      );
    case 4:
      return (
        <div
          className="pp-mono"
          style={{
            fontSize: 11,
            marginTop: 14,
            color: "var(--pp-ink-faint)",
            lineHeight: 1.7,
          }}
        >
          claim ▸ age &gt;= 21
          <br />
          proof ▸ <span style={{ color: "var(--pp-purple)" }}>π</span>·0x9f…b3
          <br />
          state ▸ <span style={{ color: "var(--pp-q2)" }}>VERIFIED ✓</span>
        </div>
      );
    case 5:
      return (
        <div
          className="pp-mono"
          style={{
            fontSize: 11,
            marginTop: 14,
            color: "var(--pp-ink-faint)",
            lineHeight: 1.7,
          }}
        >
          agent.run( <span className="pp-redact-line" style={{ width: 54 }} /> )
          <br />→ returns{" "}
          <span className="pp-redact-line" style={{ width: 74 }} />
        </div>
      );
    default:
      return null;
  }
}

function Unlocks({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  return (
    <section className="pp-section-pad" style={{ paddingTop: 0 }}>
      <div className="pp-container">
        <div className="pp-section-head">
          <div className="pp-section-num pp-mono">
            <strong>§ 05</strong>
            <br />
            —— 06
          </div>
          <div>
            <div className="pp-section-tag pp-mono">unlocks</div>
            {(() => {
              const { head, tail } = splitTitle(translations.useCasesTitle);
              return (
                <h2 className="pp-section-title">
                  {head} <em>{tail}</em>
                </h2>
              );
            })()}
            <p className="pp-section-lead">
              {translations.useCasesDescription}
            </p>
          </div>
        </div>

        <div className="pp-bento">
          {translations.useCasesList.slice(0, 6).map((item, i) => {
            const slot = BENTO_SLOTS[i];
            return (
              <div key={i} className={`pp-b ${slot.cls}`} data-c={slot.c}>
                <div>
                  <span className="pp-label">
                    <span className="pp-ldot" /> {slot.label}
                  </span>
                  <h3
                    style={{
                      marginTop: 14,
                      ...(slot.titleSize ? { fontSize: slot.titleSize } : {}),
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={i === 2 ? { fontSize: 13 } : undefined}>
                    {item.description}
                  </p>
                </div>
                <BentoFigure index={i} />
              </div>
            );
          })}
        </div>

        <BuildCta translations={translations} />
      </div>
    </section>
  );
}

function BuildCta({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  const ctaHref =
    translations.ctaButtonHref ||
    "/docs/tokens/extensions/confidential-transfer";
  return (
    <div className="pp-cta-card">
      <div className="pp-stripe" />
      <span className="pp-cta-corner pp-tl" />
      <span className="pp-cta-corner pp-tr" />
      <span className="pp-cta-corner pp-bl" />
      <span className="pp-cta-corner pp-br" />
      <div className="pp-ascii" aria-hidden="true">
        <span className="pp-ascii-key">{"// confidential-tokens"}</span>
        <br />
        program: TokenzQdBNb…
        <br />
        encrypt(amount, pk) → cipher
        <br />
        prove(cipher, range) → π
        <br />
        verify(π, root) → <span className="pp-ascii-key">ok</span>
      </div>
      <span className="pp-cta-eyebrow">
        <span className="pp-pulse" /> LIVE ON MAINNET
      </span>
      <h3 className="pp-cta-title">{translations.ctaTitle}</h3>
      <p className="pp-cta-body">{translations.ctaDescription}</p>
      <div className="pp-cta-row">
        <Link className="pp-btn pp-btn-green" href={ctaHref}>
          {translations.ctaButton}
          {ARROW_ICON}
        </Link>
        <Link className="pp-btn pp-btn-ghost" href="/developers">
          Explore All Docs
        </Link>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────── */

export function PrivacyPage({ translations }: PrivacyPageProps) {
  return (
    <>
      <SelectionColor selectionColor="#9945FF" selectionTextColor="#FFFFFF" />
      <div className="privacy-page-design">
        <Hero translations={translations} />
        <Spectrum translations={translations} />
        <Principles translations={translations} />
        <Ticker />
        <Ecosystem title={translations.ecosystemTitle} />
        <Unlocks translations={translations} />
      </div>
    </>
  );
}
