"use client";

import {
  ContentEditor,
  Heading,
  HtmlParser,
  Section,
  Switchback,
} from "@solana-foundation/solana-lib";
import { ResponsiveBox } from "@/component-library/responsive-box";
import { useTranslations } from "next-intl";
import {
  CONTENT_BLOCKS,
  CONTENT_EDITOR_CALL_TO_ACTION,
  SWITCHBACK_BUTTON,
  SWITCHBACK_IMAGE,
} from "@/data/solutions/request-for-startups";

export function SolutionsRequestForStartupsPage() {
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
    <>
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

        <hr className="my-8" />

        <HtmlParser rawHtml={t.raw("disclaimer")} />
      </Section>
    </>
  );
}
