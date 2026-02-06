"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLinkIcon,
  Github,
  Linkedin,
  Link2,
  MessageCircle,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  VisuallyHidden,
} from "@workspace/ui";
import sponsorsData from "@/data/sponsors.json";
import { getSponsorsByTier } from "@/lib/sponsors";
import type { Sponsor, SponsorTier } from "@/types/sponsors";
import { getImagePath } from "@/config";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const GRID_API_ENDPOINT = "https://beta.node.thegrid.id/graphql";

const GRID_PROFILE_QUERY = `
  query SponsorProfiles($slugs: [String!]) {
    profileInfos(where: { root: { slug: { _in: $slugs } } }) {
      name
      logo
      tagLine
      descriptionShort
      descriptionLong
      foundingDate
      profileSector {
        name
      }
      profileStatus {
        name
      }
      profileType {
        name
      }
      urls {
        url
        urlType {
          name
        }
      }
      root {
        slug
        socials {
          socialType {
            name
          }
          urls {
            url
            urlType {
              name
            }
          }
        }
      }
    }
  }
`;

type GridProfileUrl = {
  url?: string | null;
  urlType?: { name?: string | null } | null;
};

type GridProfileSocial = {
  socialType?: { name?: string | null } | null;
  urls?: GridProfileUrl[] | null;
};

type GridProfile = {
  name?: string | null;
  logo?: string | null;
  tagLine?: string | null;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  foundingDate?: string | null;
  profileSector?: { name?: string | null } | null;
  profileStatus?: { name?: string | null } | null;
  profileType?: { name?: string | null } | null;
  urls?: GridProfileUrl[] | null;
  root?: { slug?: string | null; socials?: GridProfileSocial[] | null } | null;
};

type GridResponse = {
  data?: { profileInfos?: GridProfile[] };
  errors?: Array<{ message?: string }>;
};

const SOCIAL_PRIORITY = [
  "Twitter / X",
  "Discord",
  "Telegram",
  "LinkedIn",
  "YouTube",
  "Medium",
  "GitHub",
];

const URL_TYPE_PRIORITY = ["main", "website", "app", "documentation", "blog"];

function getQuickLinkIcon(label: string, url?: string) {
  const labelNorm = label.toLowerCase().trim();

  switch (labelNorm) {
    case "website":
      return ExternalLinkIcon;
    case "data page":
      return ArrowUpRight;
    case "github":
      return Github;
    case "linkedin":
      return Linkedin;
    case "telegram":
      return Send;
    case "twitter / x":
    case "twitter":
    case "x":
      return Twitter;
    case "discord":
      return MessageCircle;
    case "youtube":
      return Youtube;
    case "medium":
      return BookOpen;
    default:
      if (url) {
        const href = url.toLowerCase();
        if (href.includes("twitter.com") || href.includes("x.com"))
          return Twitter;
        if (href.includes("discord.gg") || href.includes("discord.com"))
          return MessageCircle;
        if (href.includes("youtube.com")) return Youtube;
        if (href.includes("medium.com")) return BookOpen;
        if (href.includes("linkedin.com")) return Linkedin;
        if (href.includes("github.com")) return Github;
        if (href.includes("t.me")) return Send;
      }
      return Link2;
  }
}

function getMainUrl(profile?: GridProfile) {
  const urls = profile?.urls ?? [];
  if (!urls.length) return undefined;

  for (const type of URL_TYPE_PRIORITY) {
    const match = urls.find(
      (item) => item?.urlType?.name?.toLowerCase() === type,
    );
    if (match?.url) return match.url;
  }

  return urls[0]?.url ?? undefined;
}

function getSocialLinks(profile?: GridProfile) {
  const socials = profile?.root?.socials ?? [];
  const seen = new Set<string>();
  const links: Array<{ label: string; url: string }> = [];

  for (const social of socials) {
    const label = social?.socialType?.name;
    const url = social?.urls?.[0]?.url;
    if (!label || !url || seen.has(label)) continue;
    seen.add(label);
    links.push({ label, url });
  }

  links.sort((a, b) => {
    const indexA = SOCIAL_PRIORITY.indexOf(a.label);
    const indexB = SOCIAL_PRIORITY.indexOf(b.label);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return links;
}

async function fetchGridProfiles(slugs: string[], signal?: AbortSignal) {
  const response = await fetch(GRID_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRID_PROFILE_QUERY,
      variables: { slugs },
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Grid request failed (${response.status})`);
  }

  const payload = (await response.json()) as GridResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Grid request failed");
  }

  const profiles = payload.data?.profileInfos ?? [];
  return profiles.reduce<Record<string, GridProfile>>((acc, profile) => {
    const slug = profile.root?.slug;
    if (slug) acc[slug] = profile;
    return acc;
  }, {});
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative z-10 flex h-full w-full items-center justify-center"
    >
      <img
        src={getImagePath(sponsor.logo)}
        alt={sponsor.name}
        className="max-h-full max-w-full object-contain"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(73%) sepia(6%) saturate(354%) hue-rotate(210deg) brightness(93%) contrast(88%)",
        }}
      />
    </motion.div>
  );
}

type ActiveSponsor = {
  sponsor: Sponsor;
  tier: SponsorTier;
};

export function Sponsors() {
  const sponsorTiers = getSponsorsByTier(sponsorsData.sponsors as Sponsor[]);
  const [activeSponsor, setActiveSponsor] = useState<ActiveSponsor | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilesBySlug, setProfilesBySlug] = useState<
    Record<string, GridProfile>
  >({});
  const [unmatchedSlugs, setUnmatchedSlugs] = useState<Record<string, boolean>>(
    {},
  );
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeSlug = activeSponsor?.sponsor.gridProfileSlug ?? null;
  const activeProfile = activeSlug ? profilesBySlug[activeSlug] : undefined;
  const isLoading = Boolean(loadingSlug);
  const activeMainUrl = activeProfile ? getMainUrl(activeProfile) : undefined;
  const activeSocials = activeProfile
    ? getSocialLinks(activeProfile).slice(0, 4)
    : [];
  const activeMeta = [
    activeProfile?.profileSector?.name,
    activeProfile?.profileType?.name,
    activeProfile?.profileStatus?.name,
  ].filter(Boolean);
  const activeDescription =
    activeProfile?.descriptionLong ?? activeProfile?.descriptionShort;
  const isProfileMissing = Boolean(activeSlug && unmatchedSlugs[activeSlug]);
  const activeDisplayName =
    activeProfile?.name ?? activeSponsor?.sponsor.name ?? "Sponsor";
  const activeTierName = activeSponsor?.tier.name ?? "Sponsor Tier";
  const dataPageUrl = activeSlug
    ? `https://thegrid.id/profiles/${activeSlug}`
    : undefined;
  const activeQuickLinks = [
    activeMainUrl ? { label: "Website", url: activeMainUrl } : null,
    dataPageUrl ? { label: "Data page", url: dataPageUrl } : null,
    ...activeSocials.map((social) => ({
      label: social.label,
      url: social.url,
    })),
  ].filter((item): item is { label: string; url: string } => item !== null);

  useEffect(() => {
    if (!isModalOpen || !activeSponsor) return;

    const slug = activeSponsor.sponsor.gridProfileSlug;
    if (!slug || profilesBySlug[slug] || unmatchedSlugs[slug]) return;

    const controller = new AbortController();
    setLoadError(null);
    setLoadingSlug(slug);

    fetchGridProfiles([slug], controller.signal)
      .then((profiles) => {
        if (!profiles[slug]) {
          setUnmatchedSlugs((prev) => ({ ...prev, [slug]: true }));
        }
        setProfilesBySlug((prev) => ({ ...prev, ...profiles }));
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setLoadError(
          error instanceof Error ? error.message : "Unable to load Grid data.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingSlug(null);
        }
      });

    return () => controller.abort();
  }, [activeSponsor, isModalOpen, profilesBySlug, unmatchedSlugs]);

  function handleOpenSponsor(sponsor: Sponsor, tier: SponsorTier) {
    setActiveSponsor({ sponsor, tier });
    setIsModalOpen(true);
  }

  if (sponsorTiers.length === 0) {
    return null;
  }

  return (
    <section id="sponsors" className="relative bg-black py-12 lg:py-16">
      {/* Pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <Image
          src={getImagePath("/images/pattern-bgr.svg")}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header section with title and button */}
          <motion.div
            variants={fadeInUp}
            className="mb-8 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-center"
          >
            <div className="flex flex-col">
              <h2
                className="text-h1 text-accelerate-gray-100"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                Sponsors
              </h2>
            </div>
            {/* Mobile: Simple link */}
            <a
              href="mailto:events@solana.org"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.05em] text-accelerate-green underline underline-offset-4 transition-colors hover:text-white lg:hidden"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              <span>BECOME A SPONSOR</span>
              <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
                <path
                  d="M2 9L9 2M9 2H4M9 2V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            {/* Desktop: Styled button */}
            <a
              href="mailto:events@solana.org"
              className="hidden items-center gap-2 rounded-full px-8 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5 lg:inline-flex"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontSize: "16px",
                background:
                  "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                border: "1px solid transparent",
              }}
            >
              <span>BECOME A SPONSOR</span>
              <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
                <path
                  d="M2 9L9 2M9 2H4M9 2V7"
                  stroke="#19FB9B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          <div className="space-y-16 lg:space-y-20">
            {sponsorTiers.map((tier) => (
              <div key={tier.name}>
                <motion.p
                  variants={fadeInUp}
                  className="text-button mb-8 text-center uppercase tracking-[0.2em]"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                    color: tier.color,
                  }}
                >
                  {tier.name}
                </motion.p>
                <div
                  className={`flex flex-wrap items-center justify-center ${
                    tier.level === "headline"
                      ? "gap-16"
                      : tier.level === "signature"
                        ? "gap-12 lg:gap-[60px]"
                        : "gap-8 lg:gap-12"
                  }`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <button
                      key={sponsor.name}
                      type="button"
                      onClick={() => handleOpenSponsor(sponsor, tier)}
                      aria-haspopup="dialog"
                      aria-label={`Open ${sponsor.name} profile`}
                      className={`flex items-center justify-center bg-transparent p-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accelerate-purple/60 ${
                        tier.level === "headline"
                          ? "h-[168px] w-[400px]"
                          : tier.level === "signature"
                            ? "h-[134px] w-[320px]"
                            : "h-[80px] w-[200px]"
                      }`}
                    >
                      <SponsorLogo sponsor={sponsor} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) {
                setActiveSponsor(null);
                setLoadError(null);
                setLoadingSlug(null);
              }
            }}
          >
            <DialogContent className="max-w-[980px] overflow-hidden border-white/10 bg-[#07070a] p-0 text-white shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
              <div className="relative">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_5%_0%,rgba(153,69,255,0.22),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_95%_0%,rgba(25,251,155,0.16),transparent_60%)]" />
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accelerate-purple via-accelerate-green to-accelerate-cyan" />
                </div>
                <div className="relative max-h-[85vh] space-y-6 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8">
                  <DialogHeader className="gap-4">
                    <VisuallyHidden>
                      <DialogTitle>
                        {activeSponsor
                          ? `${activeDisplayName} sponsor profile`
                          : "Sponsor profile"}
                      </DialogTitle>
                    </VisuallyHidden>
                  </DialogHeader>

                  {!activeSponsor && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                      Select a sponsor logo to view their Grid profile.
                    </div>
                  )}

                  {loadError && (
                    <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {loadError}
                    </div>
                  )}

                  {isLoading && (
                    <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                      Loading sponsor profile from The Grid...
                    </div>
                  )}

                  {activeSponsor && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                          <div className="relative flex h-20 w-36 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-500/20 p-3">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                            <img
                              src={getImagePath(activeSponsor.sponsor.logo)}
                              alt={activeDisplayName}
                              className="relative z-10 max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="space-y-3">
                            <p className="text-2xl font-semibold text-white">
                              {activeDisplayName}
                            </p>
                            {activeProfile?.tagLine && (
                              <p className="text-sm text-white/70">
                                {activeProfile.tagLine}
                              </p>
                            )}
                          </div>
                        </div>

                        {activeMeta.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
                            {activeMeta.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-white/10 px-3 py-1"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-start gap-4">
                        {activeQuickLinks.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            {activeQuickLinks.map((link) => {
                              const Icon = getQuickLinkIcon(
                                link.label,
                                link.url,
                              );
                              return (
                                <a
                                  key={`${link.label}-${link.url}`}
                                  href={link.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={link.label}
                                  title={link.label}
                                  className="group inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white"
                                >
                                  <Icon className="size-4" />
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                        <h4 className="text-xs uppercase tracking-[0.32em] text-white/60">
                          About
                        </h4>
                        <p className="mt-3 text-sm text-white/70">
                          {activeDescription ??
                            "No description is available for this profile yet."}
                        </p>
                      </div>

                      {!activeSlug && (
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-accelerate-gray-100/70">
                          No Grid profile is mapped for this sponsor yet.
                        </div>
                      )}

                      {isProfileMissing && !isLoading && (
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-accelerate-gray-100/70">
                          Grid profile not returned yet. Use the data page link
                          to verify the profile.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}
