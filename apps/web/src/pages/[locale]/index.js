import { getPage } from "@/lib/builder/page/api";
import Layout from "@/components/solutions/layout";
import { withLocales } from "@workspace/i18n/routing";
import { Hero } from "@/components/index/hero";
import { useTranslations } from "next-intl";
import HTMLHead from "@/components/HTMLHead";

export default function Home() {
  const t = useTranslations();

  return (
    <Layout>
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
