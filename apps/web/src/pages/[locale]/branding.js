import styled from "styled-components";
import { useTranslations } from "next-intl";
import { withLocales } from "@/i18n/routing";
import Script from "next/script";

import Layout from "@/components/layout";
import HTMLHead from "@/components/HTMLHead";

import BrandingWelcome from "@/components/branding/BrandingWelcome";
import BrandingLogo from "@/components/branding/BrandingLogo";
import BrandingClearspace from "@/components/branding/BrandingClearspace";
import BrandingBannedLogos from "@/components/branding/BrandingBannedLogos";
import BrandingColors from "@/components/branding/BrandingColors";
import BrandingAssets from "@/components/branding/BrandingAssets";
import BrandingPress from "@/components/branding/BrandingPress";
import BrandingAnchorTags from "@/components/branding/BrandingAnchorTags";
import SimpleHero from "@/components/sharedPageSections/SimpleHero";

const StyledMainContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  column-gap: 4rem;
  row-gap: 2rem;
  @media (min-width: 750px) {
    flex-direction: row;
    justify-content: space-between;
  }

  .left-content {
    display: flex;
    flex-direction: column;
    row-gap: 4rem;
    flex: 1;
    max-width: 680px;
  }

  .right-content {
    min-width: 240px;
    max-width: 100%;
    @media (min-width: 750px) {
      max-width: 240px;
      & > section {
        position: sticky;
        top: 3rem;
      }
    }
  }
`;

const Branding = () => {
  const t = useTranslations();

  return (
    <Layout>
      <HTMLHead
        title={t("branding.title")}
        description={t("branding.description")}
        socialShare="src/img/branding/solanaLogo.png"
      />
      <SimpleHero
        frontmatter={{
          title: t("branding.title"),
        }}
      />
      <StyledMainContainer className="container pt-8">
        <div className="left-content">
          <BrandingWelcome />
          <BrandingLogo />
          <BrandingClearspace />
          <BrandingBannedLogos />
          <BrandingColors />
          <BrandingAssets />
          <BrandingPress />
        </div>
        <div className="right-content">
          <BrandingAnchorTags />
        </div>
      </StyledMainContainer>

      <Script id="branding-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ImageObject",
              contentUrl: "https://solana.com/src/img/branding/solanaLogo.png",
              name: "Official Solana full logo (horizontal)",
              description:
                "Official Solana full logo and brand asset for use in media and design.",
              license: "https://solana.com/branding",
            },
            {
              "@type": "ImageObject",
              contentUrl:
                "https://solana.com/src/img/branding/solanaLogoMark.png",
              name: "Official Solana logo mark icon",
              description:
                "Official Solana logo mark icon for use in media and design.",
              license: "https://solana.com/branding",
            },
            {
              "@type": "ImageObject",
              contentUrl:
                "https://solana.com/src/img/branding/solanaWordMark.png",
              name: "Official Solana wordmark",
              description:
                "Official Solana wordmark for use in media and design.",
              license: "https://solana.com/branding",
            },
            {
              "@type": "ImageObject",
              contentUrl:
                "https://solana.com/src/img/branding/solanaVerticalLogo.png",
              name: "Official Solana vertical logo",
              description:
                "Official Solana vertical logo for use in media and design.",
              license: "https://solana.com/branding",
            },
            {
              "@type": "ImageObject",
              contentUrl:
                "https://solana.com/src/img/branding/solanaFoundationLogo.png",
              name: "Official Solana Foundation logo",
              description:
                "Official Solana Foundation logo for use in media and design.",
              license: "https://solana.com/branding",
            },
          ],
        })}
      </Script>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  const messages = (await import(`@@/public/locales/${locale}/common.json`))
    .default;

  return {
    props: {
      locale,
      messages,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}

export default Branding;
