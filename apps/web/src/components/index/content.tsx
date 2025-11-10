import { getPage } from "@/lib/builder/page/api";
import Layout from "@/components/solutions/layout";
import { withLocales } from "@workspace/i18n/routing";
import { Hero } from "@/components/index/hero";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";
import { Logos } from "@/component-library/logos";
import { Divider } from "@/component-library/divider";
import { LOGOS } from "@/data/index/data";
import { CardCariuselSection } from "@/component-library/card-cariusel-section";
import { PlaceMediaCard } from "@/component-library/place-media-card";

export default function HomeContent() {
  const t = useTranslations();

  return (
    <Layout className="bg-nd-bg">
      <HTMLHead
        title={t("index.meta.title")}
        description={t("index.meta.description")}
        socialShare="/src/img/index/og-image.jpeg"
      />

      <Hero
        title={t.rich("index.hero.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        subtitle={t("index.hero.subtitle")}
        bannerEyebrow={t("index.hero.bannerEyebrow")}
        bannerDescription={t("index.hero.bannerDescription")}
        bannerImgSrc="/src/img/index/hero-banner.webp"
        // TODO: Add banner href
        bannerHref="#"
        bannerLabel={t("index.hero.bannerLabel")}
        // TODO: Add onCtaClick function
        onCtaClick={() => {}}
        cta={t("index.hero.cta")}
        bgVideoSrc="/src/img/index/hero-bg.webm"
        bgVideoPoster="/src/img/index/hero-bg.webp"
      />

      <Logos
        className="h-[73px] xl:h-[123px] gap-twd-6 xl:gap-twd-12 justify-start max-w-screen-2xl w-full mx-twd-auto px-twd-5 md:px-twd-8 xl:px-twd-10 py-twd-6 xl:py-twd-11"
        itemClassName="h-full m-0"
        logos={LOGOS}
        animation={false}
      />

      <Divider />

      <CardCariuselSection
        title={t.rich("index.events.title", {
          light: (chunks) => (
            <>
              <br />
              <span className="font-light">{chunks}</span>
            </>
          ),
        })}
        subtitle={t("index.events.subtitle")}
        totalItems={3}
        desktopLastPageOffset={2}
        tabletLastPageOffset={2}
        cardWidthClassName="w-full md:w-[350px] xl:w-[450px]"
      >
        <PlaceMediaCard
          imageSrc="https://img.youtube.com/vi/4jbz_YGzrVk/maxresdefault.jpg"
          title="Event 1"
          date="2025-01-01"
          location="New York"
          href="https://www.youtube.com/watch?v=4jbz_YGzrVk"
        />
        <PlaceMediaCard
          imageSrc="https://img.youtube.com/vi/4jbz_YGzrVk/maxresdefault.jpg"
          title="Event 2"
          date="2025-01-02"
          location="Los Angeles"
        />
        <PlaceMediaCard
          imageSrc="https://img.youtube.com/vi/4jbz_YGzrVk/maxresdefault.jpg"
          title="Event 3"
          date="2025-01-03"
          location="Chicago"
        />
      </CardCariuselSection>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  try {
    const page = await getPage("/", locale);
    const messages = (await import(`@@/public/locales/${locale}/common.json`))
      .default;

    return {
      props: {
        locale,
        key: page?.id + page?.data.slug + locale,
        page: page || null,
        messages,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
