import {
  buildBuilderJsonLd,
  serializeJsonLd,
} from "@@/src/lib/structured-data";
import { About } from "@@/src/components/About";
import { ComeBuild } from "@@/src/components/ComeBuild";
import { Faq } from "@@/src/components/Faq";
import { Footer } from "@@/src/components/Footer";
import { Forge } from "@@/src/components/Forge";
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
  const jsonLd = await buildBuilderJsonLd(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
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
      <Forge />
    </>
  );
}
