"use client";

import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import {
  GENERAL_ADMISSION_HREF,
  SIDE_EVENTS_HREF,
  SPONSOR_FORM_HREF,
} from "@/content/links";

type ComingSoonPageProps = {
  cta?: {
    href: string;
    label: string;
  };
  description: string;
  title: string;
};

export default function ComingSoonPage({
  cta,
  description,
  title,
}: ComingSoonPageProps) {
  const t = useTranslations("breakpoint.pages.comingSoon");
  const releaseLinks = [
    { href: "/travel", label: t("releaseLinks.travel") },
    { href: SPONSOR_FORM_HREF, label: t("releaseLinks.sponsor") },
    { href: SIDE_EVENTS_HREF, label: t("releaseLinks.sideEvents") },
  ];

  return (
    <PageShell
      contentId={`breakpoint-${title.toLowerCase()}-coming-soon-content`}
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: t("ticketsCta"),
        showMenuButton: true,
      }}
    >
      <SubpageHero
        heroImage={false}
        eyebrow={t("eyebrow")}
        title={title}
        cta={
          cta ?? {
            href: GENERAL_ADMISSION_HREF,
            label: t("ticketsCta"),
          }
        }
      >
        <p className="type-p-large max-w-[720px] text-white md:text-center">
          {description}
        </p>
      </SubpageHero>

      <section className="bg-black px-xs pt-xl md:px-m md:pt-2xl">
        <div className="mx-auto grid max-w-[1376px] gap-s md:grid-cols-3">
          {releaseLinks.map((link) => (
            <div
              key={link.href}
              className="flex min-h-[220px] flex-col justify-between border border-neutral-700 bg-white/[0.03] p-s"
            >
              <p className="type-eyebrow text-white opacity-70">
                {t("liveNow")}
              </p>
              <Button
                arrow
                href={link.href}
                label={link.label}
                variant="inline"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
