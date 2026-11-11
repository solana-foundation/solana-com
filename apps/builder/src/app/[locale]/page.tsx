import { getTranslations } from "@workspace/i18n/server";
import { config } from "@@/src/config";
import { links } from "@@/src/content/links";
import { About } from "@@/src/components/About";
import { ComeBuild } from "@@/src/components/ComeBuild";
import { Faq } from "@@/src/components/Faq";
import { Footer } from "@@/src/components/Footer";
import { GetInvolved } from "@@/src/components/GetInvolved";
import { Header } from "@@/src/components/Header";
import { Hero } from "@@/src/components/Hero";

type Props = { params: Promise<{ locale: string }> };

// Launch scope is the homepage only, with the sections the copy doc covers.
// components/Campus.tsx (venues) is built but not shown: the copy doc has no
// venue copy and its figures differ. The Figma file also designs Program and
// Speakers sections; they are intentionally not built until that content is
// announced.
export default async function BuilderPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "builder.metadata" });

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: config.event.name,
    description: t("description"),
    startDate: config.event.startDate,
    endDate: config.event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: config.publicUrl,
    image: config.socialShare,
    location: {
      "@type": "Place",
      name: config.event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: config.event.city,
        addressRegion: config.event.region,
        addressCountry: config.event.country,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Solana Foundation",
      url: "https://solana.com",
    },
    ...(links.register
      ? { offers: { "@type": "Offer", url: links.register } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <About locale={locale} />
        <GetInvolved locale={locale} />
        <Faq locale={locale} />
        <ComeBuild locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
