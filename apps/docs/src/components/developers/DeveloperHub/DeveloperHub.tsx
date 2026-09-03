"use client";

import { Link } from "@solana-com/ui-chrome/link";
import type { DeveloperUpdate } from "@/lib/developer-media";
import styles from "./DeveloperHub.module.scss";

type HubLink = {
  title: string;
  description: string;
  href: string;
};

const pathways: Array<HubLink & { label: string; links: HubLink[] }> = [
  {
    label: "Learn the stack",
    title: "Start with the primitives.",
    description:
      "Learn the accounts, transactions, programs, tokens, RPC, and client tooling behind Solana apps.",
    href: "/docs",
    links: [
      {
        title: "Quick start",
        description: "Build your first program and interact with the network.",
        href: "/docs/intro/quick-start",
      },
      {
        title: "Programs",
        description: "Write, deploy, and work with onchain programs.",
        href: "/docs/core/programs",
      },
      {
        title: "RPC",
        description: "Connect apps and infrastructure to Solana.",
        href: "/docs/rpc",
      },
    ],
  },
  {
    label: "Build by example",
    title: "Begin with working code.",
    description:
      "Browse templates, adapt cookbook recipes, or follow a structured course from the first commit onward.",
    href: "/developers/templates",
    links: [
      {
        title: "Templates",
        description: "Start from an app, game, protocol, or tool template.",
        href: "/developers/templates",
      },
      {
        title: "Cookbook",
        description: "Practical recipes for common development tasks.",
        href: "/developers/cookbook",
      },
      {
        title: "Developer Bootcamp",
        description: "Structured courses and workshops for builders.",
        href: "/developers/bootcamp",
      },
    ],
  },
  {
    label: "Move to Solana",
    title: "Bring your existing stack.",
    description:
      "Map familiar EVM and Cosmos patterns to the SVM with migration guides designed for production teams.",
    href: "/developers/migrate-to-solana",
    links: [
      {
        title: "EVM to SVM",
        description:
          "Compare Ethereum patterns with Solana's programming model.",
        href: "/developers/migrate-to-solana/ethereum",
      },
      {
        title: "Cosmos to SVM",
        description: "Plan a migration from app chains and CosmWasm.",
        href: "/developers/migrate-to-solana/cosmos",
      },
      {
        title: "Complete guide",
        description: "A practical end-to-end migration reference.",
        href: "/developers/migrate-to-solana/complete-guide",
      },
    ],
  },
];

const products: HubLink[] = [
  {
    title: "Kora",
    description:
      "Enable fee-free transactions or let users pay fees in any token.",
    href: "/docs/tools/kora",
  },
  {
    title: "Commerce Kit",
    description: "An e-commerce toolkit for Solana-powered online stores.",
    href: "/docs/tools/commerce-kit",
  },
  {
    title: "Solana Pay",
    description: "Simple, secure payment integration for Solana applications.",
    href: "/docs/tools/solana-pay",
  },
  {
    title: "Attestations",
    description: "Verifiable credentials and identity management for Solana.",
    href: "/docs/tools/attestations",
  },
  {
    title: "Private Channels",
    description: "An enterprise layer for internet capital markets.",
    href: "/docs/tools/private-channels",
  },
  {
    title: "ConnectorKit",
    description: "Headless wallet connection components and utilities.",
    href: "https://connectorkit.dev/",
  },
];

const partners: HubLink[] = [
  {
    title: "Blueshift",
    description: "Solana-focused development shop and implementation partner.",
    href: "https://blueshift.gg/",
  },
  {
    title: "Exo Technologies",
    description: "Product and protocol development support for Solana teams.",
    href: "https://www.exotechnologies.xyz/",
  },
  {
    title: "Hoodies",
    description:
      "Hands-on partner for building and shipping Solana experiences.",
    href: "https://hoodies.team/",
  },
  {
    title: "Lazer",
    description:
      "Engineering and product development for high-quality Solana apps.",
    href: "https://www.lazertechnologies.com/",
  },
  {
    title: "Moonsong Labs",
    description:
      "Technical partner for protocol, app, and integration development.",
    href: "",
  },
  {
    title: "Turbine3",
    description:
      "Ecosystem builder and development education partner on Solana.",
    href: "https://turbin3.org/",
  },
];

const updateTopics = [
  { title: "Developer news", href: "/news/category/developers" },
  { title: "Changelog", href: "/changelog" },
  { title: "Upgrades", href: "/upgrades" },
  { title: "Developer", href: "/news/tag/developer" },
  { title: "API", href: "/news/tag/api" },
  { title: "Technology", href: "/news/tag/technology" },
  { title: "Network", href: "/news/tag/network" },
];

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.eyebrow}>
      <span aria-hidden="true" />
      {children}
    </p>
  );
}

function Arrow({ external = false }: { external?: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export function DeveloperHub({ updates }: { updates: DeveloperUpdate[] }) {
  return (
    <main className={styles.hub}>
      <section className={styles.hero}>
        <div className={styles.frame}>
          <Eyebrow>Developer hub</Eyebrow>
          <div className={styles.heroGrid}>
            <div>
              <h1>Build on Solana.</h1>
              <p className={styles.heroCopy}>
                The docs, code, products, and people to turn an idea into
                something live on Solana.
              </p>
              <div className={styles.actions}>
                <Link to="/docs" className={styles.primaryAction}>
                  Read the core docs <Arrow />
                </Link>
                <Link
                  to="/developers/templates"
                  className={styles.secondaryAction}
                >
                  Browse templates <Arrow />
                </Link>
              </div>
            </div>
            <aside
              className={styles.heroSignal}
              aria-label="Developer hub focus"
            >
              <span>THE BUILD SIGNAL</span>
              <strong>Learn / Build / Ship</strong>
              <p>
                Choose a path, then move into the references and tooling that
                make it real.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.pathways} aria-labelledby="paths-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Choose a starting point</Eyebrow>
            <h2 id="paths-heading">Pick the path that matches your build.</h2>
          </div>
          <div className={styles.pathwayGrid}>
            {pathways.map((pathway) => (
              <article className={styles.pathway} key={pathway.label}>
                <span className={styles.pathwayLabel}>{pathway.label}</span>
                <h3>{pathway.title}</h3>
                <p>{pathway.description}</p>
                <Link to={pathway.href} className={styles.pathwayCta}>
                  Explore this path <Arrow />
                </Link>
                <ul>
                  {pathway.links.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href}>
                        <span>{link.title}</span>
                        <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.updates} aria-labelledby="updates-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Developer updates</Eyebrow>
            <h2 id="updates-heading">
              What changed, what is shipping, and what is next.
            </h2>
            <p>
              A current read on developer news, engineering changes, network
              upgrades, and shipped releases.
            </p>
          </div>
          {updates.length > 0 && (
            <div className={styles.updateGrid}>
              {updates.map((update) => (
                <Link
                  to={update.href}
                  className={styles.updateCard}
                  key={`${update.kind}-${update.href}`}
                >
                  <div>
                    <span>{update.kind}</span>
                    {formatDate(update.publishedAt) && (
                      <time dateTime={update.publishedAt}>
                        {formatDate(update.publishedAt)}
                      </time>
                    )}
                  </div>
                  <h3>{update.title}</h3>
                  <p>{update.description}</p>
                  <b>
                    Read update <Arrow />
                  </b>
                </Link>
              ))}
            </div>
          )}
          <nav
            className={styles.topicLinks}
            aria-label="Developer update topics"
          >
            {updateTopics.map((topic) => (
              <Link to={topic.href} key={topic.href}>
                {topic.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className={styles.directory} aria-labelledby="directory-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Developer products</Eyebrow>
            <h2 id="directory-heading">
              The tools and references for shipping.
            </h2>
            <p>
              Current products and documentation that now belong in the core
              Solana developer experience.
            </p>
          </div>
          <div className={styles.directoryGrid}>
            {products.map((product) => (
              <Link
                to={product.href}
                className={styles.directoryCard}
                key={product.title}
              >
                <h3>
                  {product.title}{" "}
                  <Arrow external={product.href.startsWith("http")} />
                </h3>
                <p>{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.partners} aria-labelledby="partners-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Development partners</Eyebrow>
            <h2 id="partners-heading">
              Bring in a Solana-native team when you need one.
            </h2>
            <p>
              Service providers and development shops for teams seeking hands-on
              implementation support.
            </p>
          </div>
          <div className={styles.partnerGrid}>
            {partners.map((partner) => {
              const content = (
                <>
                  <h3>{partner.title}</h3>
                  <p>{partner.description}</p>
                  {partner.href && (
                    <b>
                      Visit partner <Arrow external />
                    </b>
                  )}
                </>
              );

              return partner.href ? (
                <Link
                  to={partner.href}
                  className={styles.partnerCard}
                  key={partner.title}
                >
                  {content}
                </Link>
              ) : (
                <article className={styles.partnerCard} key={partner.title}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
