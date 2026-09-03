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
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Link } from "@solana-com/ui-chrome/link";
import EmailSubscribeForm from "@/components/shared/EmailSubscribeForm";
import { YT_PLAYLIST_CHANGELOG } from "@/constants/developerContentConfig";
import type { DeveloperUpdate } from "@/lib/developer-media";
import styles from "./DeveloperHub.module.scss";

type HubLink = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon?: typeof BookOpen;
};

type Pathway = HubLink & {
  labelKey: string;
  links: HubLink[];
};

const pathways: Pathway[] = [
  {
    id: "learnStack",
    labelKey: "pathways.items.learnStack.label",
    titleKey: "pathways.items.learnStack.title",
    descriptionKey: "pathways.items.learnStack.description",
    href: "/docs",
    icon: BookOpen,
    links: [
      {
        id: "quickStart",
        titleKey: "pathways.items.learnStack.links.quickStart.title",
        descriptionKey:
          "pathways.items.learnStack.links.quickStart.description",
        href: "/docs/intro/quick-start",
      },
      {
        id: "programs",
        titleKey: "pathways.items.learnStack.links.programs.title",
        descriptionKey: "pathways.items.learnStack.links.programs.description",
        href: "/docs/core/programs",
      },
      {
        id: "rpc",
        titleKey: "pathways.items.learnStack.links.rpc.title",
        descriptionKey: "pathways.items.learnStack.links.rpc.description",
        href: "/docs/rpc",
      },
    ],
  },
  {
    id: "buildByExample",
    labelKey: "pathways.items.buildByExample.label",
    titleKey: "pathways.items.buildByExample.title",
    descriptionKey: "pathways.items.buildByExample.description",
    href: "/developers/templates",
    icon: CodeAlt,
    links: [
      {
        id: "templates",
        titleKey: "pathways.items.buildByExample.links.templates.title",
        descriptionKey:
          "pathways.items.buildByExample.links.templates.description",
        href: "/developers/templates",
      },
      {
        id: "cookbook",
        titleKey: "pathways.items.buildByExample.links.cookbook.title",
        descriptionKey:
          "pathways.items.buildByExample.links.cookbook.description",
        href: "/developers/cookbook",
      },
      {
        id: "bootcamp",
        titleKey: "pathways.items.buildByExample.links.bootcamp.title",
        descriptionKey:
          "pathways.items.buildByExample.links.bootcamp.description",
        href: "/developers/bootcamp",
      },
    ],
  },
  {
    id: "moveToSolana",
    labelKey: "pathways.items.moveToSolana.label",
    titleKey: "pathways.items.moveToSolana.title",
    descriptionKey: "pathways.items.moveToSolana.description",
    href: "/developers/migrate-to-solana",
    icon: GitCompare,
    links: [
      {
        id: "evmToSvm",
        titleKey: "pathways.items.moveToSolana.links.evmToSvm.title",
        descriptionKey:
          "pathways.items.moveToSolana.links.evmToSvm.description",
        href: "/developers/migrate-to-solana/ethereum",
      },
      {
        id: "cosmosToSvm",
        titleKey: "pathways.items.moveToSolana.links.cosmosToSvm.title",
        descriptionKey:
          "pathways.items.moveToSolana.links.cosmosToSvm.description",
        href: "/developers/migrate-to-solana/cosmos",
      },
      {
        id: "completeGuide",
        titleKey: "pathways.items.moveToSolana.links.completeGuide.title",
        descriptionKey:
          "pathways.items.moveToSolana.links.completeGuide.description",
        href: "/developers/migrate-to-solana/complete-guide",
      },
    ],
  },
];

const products: HubLink[] = [
  {
    id: "kora",
    titleKey: "products.items.kora.title",
    descriptionKey: "products.items.kora.description",
    href: "/docs/tools/kora",
    icon: Bolt,
  },
  {
    id: "commerceKit",
    titleKey: "products.items.commerceKit.title",
    descriptionKey: "products.items.commerceKit.description",
    href: "/docs/tools/commerce-kit",
    icon: Package,
  },
  {
    id: "solanaPay",
    titleKey: "products.items.solanaPay.title",
    descriptionKey: "products.items.solanaPay.description",
    href: "/docs/tools/solana-pay",
    icon: Wallet,
  },
  {
    id: "attestations",
    titleKey: "products.items.attestations.title",
    descriptionKey: "products.items.attestations.description",
    href: "/docs/tools/attestations",
    icon: BadgeInfo,
  },
  {
    id: "privateChannels",
    titleKey: "products.items.privateChannels.title",
    descriptionKey: "products.items.privateChannels.description",
    href: "/docs/tools/private-channels",
    icon: MessageCircle,
  },
  {
    id: "connectorKit",
    titleKey: "products.items.connectorKit.title",
    descriptionKey: "products.items.connectorKit.description",
    href: "https://connectorkit.dev/",
    icon: LinkIcon,
  },
];

const buildAreas: HubLink[] = [
  {
    id: "payments",
    titleKey: "buildAreas.items.payments.title",
    descriptionKey: "buildAreas.items.payments.description",
    href: "/docs/payments",
    icon: Wallet,
  },
  {
    id: "tokenization",
    titleKey: "buildAreas.items.tokenization.title",
    descriptionKey: "buildAreas.items.tokenization.description",
    href: "/docs/tokenization/quickstart",
    icon: Coins,
  },
  {
    id: "tokenizedAssets",
    titleKey: "buildAreas.items.tokenizedAssets.title",
    descriptionKey: "buildAreas.items.tokenizedAssets.description",
    href: "/docs/tokenization",
    icon: Layers,
  },
  {
    id: "games",
    titleKey: "buildAreas.items.games.title",
    descriptionKey: "buildAreas.items.games.description",
    href: "/developers/cookbook/games/getting-started-with-game-development",
    icon: Joystick,
  },
  {
    id: "tools",
    titleKey: "buildAreas.items.tools.title",
    descriptionKey: "buildAreas.items.tools.description",
    href: "/docs/tools",
    icon: Spanner,
  },
];

const learningResources: HubLink[] = [
  {
    id: "courses",
    titleKey: "learning.items.courses.title",
    descriptionKey: "learning.items.courses.description",
    href: "https://learn.blueshift.gg/",
    icon: BookOpen,
  },
  {
    id: "bootcamp",
    titleKey: "learning.items.bootcamp.title",
    descriptionKey: "learning.items.bootcamp.description",
    href: "https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc",
    icon: Video,
  },
  {
    id: "bytes",
    titleKey: "learning.items.bytes.title",
    descriptionKey: "learning.items.bytes.description",
    href: "https://www.youtube.com/watch?v=pRYs49MqapI&list=PLilwLeBwGuK51Ji870apdb88dnBr1Xqhm",
    icon: PlayCircle,
  },
  {
    id: "buildOnSolana",
    titleKey: "learning.items.buildOnSolana.title",
    descriptionKey: "learning.items.buildOnSolana.description",
    href: "https://www.risein.com/courses/build-on-solana",
    icon: BookBookmark,
  },
  {
    id: "ethereumToSolana",
    titleKey: "learning.items.ethereumToSolana.title",
    descriptionKey: "learning.items.ethereumToSolana.description",
    href: "https://www.rareskills.io/solana-tutorial",
    icon: GitCompare,
  },
  {
    id: "learningTrack",
    titleKey: "learning.items.learningTrack.title",
    descriptionKey: "learning.items.learningTrack.description",
    href: "https://www.hackquest.io/en/learning-track/d22e6118-f7f6-4f31-acf2-433d08bc52e8",
    icon: Rocket,
  },
];

const supportResources: HubLink[] = [
  {
    id: "anchor",
    titleKey: "support.items.anchor.title",
    descriptionKey: "support.items.anchor.description",
    href: "https://www.anchor-lang.com/docs",
    icon: BookBookmark,
  },
  {
    id: "stackExchange",
    titleKey: "support.items.stackExchange.title",
    descriptionKey: "support.items.stackExchange.description",
    href: "https://solana.stackexchange.com/",
    icon: MessageCircleQuestionMark,
  },
  {
    id: "changelog",
    titleKey: "support.items.changelog.title",
    descriptionKey: "support.items.changelog.description",
    href: `https://www.youtube.com/playlist?list=${YT_PLAYLIST_CHANGELOG}`,
    icon: Video,
  },
  {
    id: "youtube",
    titleKey: "support.items.youtube.title",
    descriptionKey: "support.items.youtube.description",
    href: "/youtube",
    icon: PlayCircle,
  },
  {
    id: "validated",
    titleKey: "support.items.validated.title",
    descriptionKey: "support.items.validated.description",
    href: "/validated",
    icon: Podcast,
  },
];

const partners: HubLink[] = [
  {
    id: "blueshift",
    titleKey: "partners.items.blueshift.title",
    descriptionKey: "partners.items.blueshift.description",
    href: "https://blueshift.gg/",
  },
  {
    id: "exo",
    titleKey: "partners.items.exo.title",
    descriptionKey: "partners.items.exo.description",
    href: "https://www.exotechnologies.xyz/",
  },
  {
    id: "hoodies",
    titleKey: "partners.items.hoodies.title",
    descriptionKey: "partners.items.hoodies.description",
    href: "https://hoodies.team/",
  },
  {
    id: "lazer",
    titleKey: "partners.items.lazer.title",
    descriptionKey: "partners.items.lazer.description",
    href: "https://www.lazertechnologies.com/",
  },
  {
    id: "moonsong",
    titleKey: "partners.items.moonsong.title",
    descriptionKey: "partners.items.moonsong.description",
    href: "",
  },
  {
    id: "turbine3",
    titleKey: "partners.items.turbine3.title",
    descriptionKey: "partners.items.turbine3.description",
    href: "https://turbin3.org/",
  },
];

const updateTopics = [
  {
    id: "developerNews",
    labelKey: "updates.topics.developerNews",
    href: "/news/category/developers",
  },
  { id: "changelog", labelKey: "updates.topics.changelog", href: "/changelog" },
  { id: "upgrades", labelKey: "updates.topics.upgrades", href: "/upgrades" },
  {
    id: "developer",
    labelKey: "updates.topics.developer",
    href: "/news/tag/developer",
  },
  { id: "api", labelKey: "updates.topics.api", href: "/news/tag/api" },
  {
    id: "technology",
    labelKey: "updates.topics.technology",
    href: "/news/tag/technology",
  },
  {
    id: "network",
    labelKey: "updates.topics.network",
    href: "/news/tag/network",
  },
];

const updateKindKeys: Record<DeveloperUpdate["kind"], string> = {
  News: "updates.kinds.news",
  Changelog: "updates.kinds.changelog",
  Upgrade: "updates.kinds.upgrade",
  Release: "updates.kinds.release",
};

function formatDate(value: string | undefined, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
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
  const t = useTranslations("developers.hub");
  const locale = useLocale();

  return (
    <main className={styles.hub}>
      <section className={styles.hero}>
        <div className={styles.frame}>
          <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          <div className={styles.heroGrid}>
            <div>
              <h1>{t("hero.title")}</h1>
              <p className={styles.heroCopy}>{t("hero.description")}</p>
              <div className={styles.actions}>
                <Link to="/docs" className={styles.primaryAction}>
                  {t("hero.readDocs")} <Arrow />
                </Link>
                <Link
                  to="/developers/templates"
                  className={styles.secondaryAction}
                >
                  {t("hero.browseTemplates")} <Arrow />
                </Link>
              </div>
            </div>
            <aside
              className={styles.heroSignal}
              aria-label={t("hero.signalAriaLabel")}
            >
              <span>{t("hero.signalLabel")}</span>
              <strong>{t("hero.signalTitle")}</strong>
              <p>{t("hero.signalDescription")}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.pathways} aria-labelledby="paths-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>{t("pathways.eyebrow")}</Eyebrow>
            <h2 id="paths-heading">{t("pathways.title")}</h2>
          </div>
          <div className={styles.pathwayGrid}>
            {pathways.map((pathway) => (
              <article className={styles.pathway} key={pathway.id}>
                <div className={styles.pathwayMeta}>
                  <span className={styles.pathwayLabel}>
                    {t(pathway.labelKey)}
                  </span>
                  {pathway.icon && <IconBadge icon={pathway.icon} />}
                </div>
                <h3>{t(pathway.titleKey)}</h3>
                <p>{t(pathway.descriptionKey)}</p>
                <Link to={pathway.href} className={styles.pathwayCta}>
                  {t("pathways.explore")} <Arrow />
                </Link>
                <ul>
                  {pathway.links.map((link) => (
                    <li key={link.id}>
                      <Link to={link.href}>
                        <span>{t(link.titleKey)}</span>
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
            <Eyebrow>{t("buildAreas.eyebrow")}</Eyebrow>
            <h2 id="build-areas-heading">{t("buildAreas.title")}</h2>
            <p>{t("buildAreas.description")}</p>
          </div>
          <div className={styles.directoryGrid}>
            {buildAreas.map((area) => (
              <Link
                to={area.href}
                className={styles.directoryCard}
                key={area.id}
              >
                <h3>
                  <CardIcon icon={area.icon} />
                  <span>{t(area.titleKey)}</span>
                  <Arrow />
                </h3>
                <p>{t(area.descriptionKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.updates} aria-labelledby="updates-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>{t("updates.eyebrow")}</Eyebrow>
            <h2 id="updates-heading">{t("updates.title")}</h2>
            <p>{t("updates.description")}</p>
          </div>
          {updates.length > 0 && (
            <div className={styles.updateGrid}>
              {updates.map((update) => {
                const formattedDate = formatDate(update.publishedAt, locale);

                return (
                  <Link
                    to={update.href}
                    className={styles.updateCard}
                    key={`${update.kind}-${update.href}`}
                  >
                    <div>
                      <span>{t(updateKindKeys[update.kind])}</span>
                      {formattedDate && (
                        <time dateTime={update.publishedAt}>
                          {formattedDate}
                        </time>
                      )}
                    </div>
                    <h3>{update.title}</h3>
                    <p>{update.description}</p>
                    <b>
                      {t("updates.read")} <Arrow />
                    </b>
                  </Link>
                );
              })}
            </div>
          )}
          <nav
            className={styles.topicLinks}
            aria-label={t("updates.topicsAriaLabel")}
          >
            {updateTopics.map((topic) => (
              <Link to={topic.href} key={topic.id}>
                {t(topic.labelKey)}
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
              <Eyebrow>{t("newsletter.eyebrow")}</Eyebrow>
              <h2 id="newsletter-heading">{t("newsletter.title")}</h2>
              <p>{t("newsletter.description")}</p>
            </div>
            <EmailSubscribeForm formId="f1bc79b9-a1cd-463a-8c2c-e761b2fa108d" />
          </div>
        </div>
      </section>

      <section className={styles.directory} aria-labelledby="directory-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>{t("products.eyebrow")}</Eyebrow>
            <h2 id="directory-heading">{t("products.title")}</h2>
            <p>{t("products.description")}</p>
          </div>
          <div className={styles.directoryGrid}>
            {products.map((product) => (
              <Link
                to={product.href}
                className={styles.directoryCard}
                key={product.id}
              >
                <h3>
                  <CardIcon icon={product.icon} />
                  <span>{t(product.titleKey)}</span>
                  <Arrow external={product.href.startsWith("http")} />
                </h3>
                <p>{t(product.descriptionKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.learning} aria-labelledby="learning-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>{t("learning.eyebrow")}</Eyebrow>
            <h2 id="learning-heading">{t("learning.title")}</h2>
            <p>{t("learning.description")}</p>
          </div>
          <div className={styles.directoryGrid}>
            {learningResources.map((resource) => (
              <Link
                to={resource.href}
                className={styles.directoryCard}
                key={resource.id}
              >
                <h3>
                  <CardIcon icon={resource.icon} />
                  <span>{t(resource.titleKey)}</span>
                  <Arrow external />
                </h3>
                <p>{t(resource.descriptionKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.support} aria-labelledby="support-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>{t("support.eyebrow")}</Eyebrow>
            <h2 id="support-heading">{t("support.title")}</h2>
            <p>{t("support.description")}</p>
          </div>
          <div className={styles.directoryGrid}>
            {supportResources.map((resource) => (
              <Link
                to={resource.href}
                className={styles.directoryCard}
                key={resource.id}
              >
                <h3>
                  <CardIcon icon={resource.icon} />
                  <span>{t(resource.titleKey)}</span>
                  <Arrow external={resource.href.startsWith("http")} />
                </h3>
                <p>{t(resource.descriptionKey)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.partners} aria-labelledby="partners-heading">
        <div className={styles.frame}>
          <div className={styles.sectionIntro}>
            <Eyebrow>{t("partners.eyebrow")}</Eyebrow>
            <h2 id="partners-heading">{t("partners.title")}</h2>
            <p>{t("partners.description")}</p>
          </div>
          <div className={styles.partnerGrid}>
            {partners.map((partner) => {
              const content = (
                <>
                  <h3>{t(partner.titleKey)}</h3>
                  <p>{t(partner.descriptionKey)}</p>
                  {partner.href && (
                    <b>
                      {t("partners.visit")} <Arrow external />
                    </b>
                  )}
                </>
              );

              return partner.href ? (
                <Link
                  to={partner.href}
                  className={styles.partnerCard}
                  key={partner.id}
                >
                  {content}
                </Link>
              ) : (
                <article className={styles.partnerCard} key={partner.id}>
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
