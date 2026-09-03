"use client";

import { ArrowOutUpRightSquare } from "@boxicons/react/ArrowOutUpRightSquare";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { BadgeInfo } from "@boxicons/react/BadgeInfo";
import { BookBookmark } from "@boxicons/react/BookBookmark";
import { BookOpen } from "@boxicons/react/BookOpen";
import { Bolt } from "@boxicons/react/Bolt";
import { CodeAlt } from "@boxicons/react/CodeAlt";
import { Coins } from "@boxicons/react/Coins";
import { GitCompare } from "@boxicons/react/GitCompare";
import { Joystick } from "@boxicons/react/Joystick";
import { Layers } from "@boxicons/react/Layers";
import { Link as LinkIcon } from "@boxicons/react/Link";
import { MessageCircle } from "@boxicons/react/MessageCircle";
import { MessageCircleQuestionMark } from "@boxicons/react/MessageCircleQuestionMark";
import { Package } from "@boxicons/react/Package";
import { PlayCircle } from "@boxicons/react/PlayCircle";
import { Podcast } from "@boxicons/react/Podcast";
import { Rocket } from "@boxicons/react/Rocket";
import { Spanner } from "@boxicons/react/Spanner";
import { Video } from "@boxicons/react/Video";
import { Wallet } from "@boxicons/react/Wallet";
import { Link } from "@solana-com/ui-chrome/link";
import EmailSubscribeForm from "@/components/shared/EmailSubscribeForm";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";
import type { DeveloperUpdate } from "@/lib/developer-media";
import styles from "./DeveloperHub.module.scss";

type HubLink = {
  title: string;
  description: string;
  href: string;
  icon?: typeof BookOpen;
};

const pathways: Array<HubLink & { label: string; links: HubLink[] }> = [
  {
    label: "Learn the stack",
    title: "Start with the primitives.",
    description:
      "Learn the accounts, transactions, programs, tokens, RPC, and client tooling behind Solana apps.",
    href: "/docs",
    icon: BookOpen,
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
    icon: CodeAlt,
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
    icon: GitCompare,
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
    icon: Bolt,
  },
  {
    title: "Commerce Kit",
    description: "An e-commerce toolkit for Solana-powered online stores.",
    href: "/docs/tools/commerce-kit",
    icon: Package,
  },
  {
    title: "Solana Pay",
    description: "Simple, secure payment integration for Solana applications.",
    href: "/docs/tools/solana-pay",
    icon: Wallet,
  },
  {
    title: "Attestations",
    description: "Verifiable credentials and identity management for Solana.",
    href: "/docs/tools/attestations",
    icon: BadgeInfo,
  },
  {
    title: "Private Channels",
    description: "An enterprise layer for internet capital markets.",
    href: "/docs/tools/private-channels",
    icon: MessageCircle,
  },
  {
    title: "ConnectorKit",
    description: "Headless wallet connection components and utilities.",
    href: "https://connectorkit.dev/",
    icon: LinkIcon,
  },
];

const buildAreas: HubLink[] = [
  {
    title: "Accept payments on Solana",
    description:
      "Take stablecoin payments with instant settlement and sub-cent fees.",
    href: "/docs/payments",
    icon: Wallet,
  },
  {
    title: "Launch a Token-2022 asset",
    description:
      "Create a mint with metadata, pausability, and built-in controls.",
    href: "/docs/tokenization/quickstart",
    icon: Coins,
  },
  {
    title: "Explore tokenized assets",
    description: "Issue, control, settle, and operate assets onchain.",
    href: "/docs/tokenization",
    icon: Layers,
  },
  {
    title: "Get started with game development",
    description: "Build onchain games with the Solana games cookbook.",
    href: "/developers/cookbook/games/getting-started-with-game-development",
    icon: Joystick,
  },
  {
    title: "Explore developer tools",
    description: "Find SDKs, local testing, infrastructure, and references.",
    href: "/docs/tools",
    icon: Spanner,
  },
];

const learningResources: HubLink[] = [
  {
    title: "Solana Development Courses",
    description:
      "Structured Solana learning paths from Blueshift, from foundations to mobile development.",
    href: "https://learn.blueshift.gg/",
    icon: BookOpen,
  },
  {
    title: "Solana Bootcamp",
    description:
      "A Solana Foundation video course for learning the core development workflow.",
    href: "https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc",
    icon: Video,
  },
  {
    title: "Solana Bytes",
    description:
      "Short Solana Foundation video lessons for developers learning the stack.",
    href: "https://www.youtube.com/watch?v=pRYs49MqapI&list=PLilwLeBwGuK51Ji870apdb88dnBr1Xqhm",
    icon: PlayCircle,
  },
  {
    title: "Build on Solana",
    description:
      "A self-paced Rise In course covering Solana fundamentals and projects.",
    href: "https://www.risein.com/courses/build-on-solana",
    icon: BookBookmark,
  },
  {
    title: "Ethereum to Solana Developer Course",
    description:
      "RareSkills' course for experienced EVM developers moving to Solana.",
    href: "https://www.rareskills.io/solana-tutorial",
    icon: GitCompare,
  },
  {
    title: "Solana Learning Track",
    description: "HackQuest's quest-based Solana developer learning track.",
    href: "https://www.hackquest.io/en/learning-track/d22e6118-f7f6-4f31-acf2-433d08bc52e8",
    icon: Rocket,
  },
];

const supportResources: HubLink[] = [
  {
    title: "Anchor Docs",
    description:
      "Guides for building, testing, and deploying secure Solana programs with Anchor.",
    href: "https://www.anchor-lang.com/docs",
    icon: BookBookmark,
  },
  {
    title: "Solana Stack Exchange",
    description:
      "Ask and answer technical questions with the Solana developer community.",
    href: "https://solana.stackexchange.com/",
    icon: MessageCircleQuestionMark,
  },
  {
    title: "Watch the Solana Changelog",
    description:
      "Follow the video archive of Solana engineering and ecosystem updates.",
    href: `https://www.youtube.com/playlist?list=${YT_PLAYLIST_CHANGELOG}`,
    icon: Video,
  },
  {
    title: "Solana on YouTube",
    description:
      "Watch conversations with the Solana team, builders, and the wider developer community.",
    href: "/youtube",
    icon: PlayCircle,
  },
  {
    title: "Validated podcast",
    description:
      "Hear builders, researchers, and ecosystem leaders discuss the technology behind Solana.",
    href: "/validated",
    icon: Podcast,
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

function IconBadge({ icon: Icon }: { icon: typeof BookOpen }) {
  return (
    <span className={styles.iconBadge} aria-hidden="true">
      <Icon pack="filled" width={24} height={24} />
    </span>
  );
}

function CardIcon({ icon: Icon }: { icon?: typeof BookOpen }) {
  if (!Icon) return null;

  return <Icon pack="filled" width={21} height={21} aria-hidden="true" />;
}

function Arrow({ external = false }: { external?: boolean }) {
  const Icon = external ? ArrowOutUpRightSquare : ArrowRight;

  return (
    <Icon
      pack="filled"
      width={16}
      height={16}
      aria-hidden="true"
      focusable="false"
    />
  );
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
                <div className={styles.pathwayMeta}>
                  <span className={styles.pathwayLabel}>{pathway.label}</span>
                  {pathway.icon && <IconBadge icon={pathway.icon} />}
                </div>
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

      <section
        className={styles.buildAreas}
        aria-labelledby="build-areas-heading"
      >
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Build for a use case</Eyebrow>
            <h2 id="build-areas-heading">
              Start from the part of the stack you need.
            </h2>
            <p>
              Current guides for the most common products developers bring to
              Solana.
            </p>
          </div>
          <div className={styles.directoryGrid}>
            {buildAreas.map((area) => (
              <Link
                to={area.href}
                className={styles.directoryCard}
                key={area.title}
              >
                <h3>
                  <CardIcon icon={area.icon} />
                  <span>{area.title}</span>
                  <Arrow />
                </h3>
                <p>{area.description}</p>
              </Link>
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

      <section
        className={styles.newsletter}
        aria-labelledby="newsletter-heading"
      >
        <div className={styles.frame}>
          <div className={styles.newsletterPanel}>
            <div>
              <Eyebrow>Solana Developer Update</Eyebrow>
              <h2 id="newsletter-heading">
                Keep new resources, commits, and proposals within reach.
              </h2>
              <p>
                Get the developer update by email without having to chase every
                release yourself.
              </p>
            </div>
            <EmailSubscribeForm formId="f1bc79b9-a1cd-463a-8c2c-e761b2fa108d" />
          </div>
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
                  <CardIcon icon={product.icon} />
                  <span>{product.title}</span>
                  <Arrow external={product.href.startsWith("http")} />
                </h3>
                <p>{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.learning} aria-labelledby="learning-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Keep learning</Eyebrow>
            <h2 id="learning-heading">Courses from the Solana ecosystem.</h2>
            <p>
              Continue beyond the docs with active, hands-on courses for every
              stage of the development journey.
            </p>
          </div>
          <div className={styles.directoryGrid}>
            {learningResources.map((resource) => (
              <Link
                to={resource.href}
                className={styles.directoryCard}
                key={resource.title}
              >
                <h3>
                  <CardIcon icon={resource.icon} />
                  <span>{resource.title}</span>
                  <Arrow external />
                </h3>
                <p>{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.support} aria-labelledby="support-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>Documentation and community</Eyebrow>
            <h2 id="support-heading">
              Find a reference, an answer, or a deeper conversation.
            </h2>
            <p>
              The supporting material developers used from the previous hub,
              kept where it remains active and useful.
            </p>
          </div>
          <div className={styles.directoryGrid}>
            {supportResources.map((resource) => (
              <Link
                to={resource.href}
                className={styles.directoryCard}
                key={resource.title}
              >
                <h3>
                  <CardIcon icon={resource.icon} />
                  <span>{resource.title}</span>
                  <Arrow external={resource.href.startsWith("http")} />
                </h3>
                <p>{resource.description}</p>
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
