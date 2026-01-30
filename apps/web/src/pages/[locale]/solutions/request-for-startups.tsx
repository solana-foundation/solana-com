import HTMLHead from "@/components/HTMLHead";
import Layout from "@/components/layout";
import {
  ContentEditor,
  Heading,
  HtmlParser,
  Section,
  Switchback,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { withLocales } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import {
  CONTENT_BLOCKS,
  CONTENT_EDITOR_CALL_TO_ACTION,
  META,
  SWITCHBACK_BUTTON,
  SWITCHBACK_IMAGE,
} from "@/data/solutions/request-for-startups";

const RequestForStartupsPage = () => {
  const t = useTranslations("request-for-startups-solution");

  const callToAction = {
    ...CONTENT_EDITOR_CALL_TO_ACTION,
    eyebrow: t("contentEditor.callToAction.eyebrow"),
    headline: t("contentEditor.callToAction.headline"),
    description: t("contentEditor.callToAction.description"),
    button: {
      ...CONTENT_EDITOR_CALL_TO_ACTION.button,
      label: t("contentEditor.callToAction.buttonLabel"),
    },
  };

  const contentBlocks = CONTENT_BLOCKS.map((block) => {
    if (block.responsiveStyles) {
      return (
        <ResponsiveBox
          key={block.key}
          responsiveStyles={block.responsiveStyles}
        >
          <HtmlParser rawHtml={t.raw(block.key)} />
        </ResponsiveBox>
      );
    }

    return <HtmlParser key={block.key} rawHtml={t.raw(block.key)} />;
  });

  return (
    <Layout>
      <HTMLHead
        title={t("meta.seoTitle")}
        description={t("meta.seoDescription")}
        socialShare={META.seoImage}
      />

      <Section>
        <Heading
          eyebrow={t("heading.eyebrow")}
          headline={t("heading.headline")}
          body={t("heading.body")}
        />

        <ContentEditor
          callToAction={
            callToAction as React.ComponentProps<
              typeof ContentEditor
            >["callToAction"]
          }
          tocHeadline={t("contentEditor.tocHeadline")}
        >
          {contentBlocks}
        </ContentEditor>

        <Switchback
          assetSide="right"
          image={{
            alt: t("switchback.headline"),
            src: SWITCHBACK_IMAGE,
          }}
          eyebrow=""
          headline={t("switchback.headline")}
          body={t.raw("switchback.body")}
          placeholder=""
          emailError=""
          submitError=""
          successMessage=""
          buttons={
            [
              {
                ...SWITCHBACK_BUTTON,
                label: t("switchback.buttonLabel"),
              },
            ] as React.ComponentProps<typeof Switchback>["buttons"]
          }
        />

        <ResponsiveBox
          responsiveStyles={{
            large: { marginTop: "20px" },
          }}
        >
          <HtmlParser rawHtml="<br />\n<hr />\n<br />\n" />
        </ResponsiveBox>

        <HtmlParser rawHtml={t.raw("disclaimer")} />
      </Section>
    </Layout>
  );
};

export default RequestForStartupsPage;

export async function getStaticProps({
  params,
}: {
  params: { locale: string };
}) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;
  return {
    props: {
      locale,
      messages,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}
