"use client";

import Script from "next/script";

import BrandingWelcome from "@/components/branding/BrandingWelcome";
import BrandingLogo from "@/components/branding/BrandingLogo";
import BrandingClearspace from "@/components/branding/BrandingClearspace";
import BrandingBannedLogos from "@/components/branding/BrandingBannedLogos";
import BrandingColors from "@/components/branding/BrandingColors";
import BrandingAssets from "@/components/branding/BrandingAssets";
import BrandingPress from "@/components/branding/BrandingPress";
import BrandingAnchorTags from "@/components/branding/BrandingAnchorTags";
import SimpleHero from "@/components/sharedPageSections/SimpleHero";

interface BrandingPageProps {
  translations: {
    title: string;
  };
}

export function BrandingPage({ translations }: BrandingPageProps) {
  return (
    <>
      <SimpleHero
        frontmatter={{
          title: translations.title,
        }}
      />
      <div className="container pt-12 pb-10 flex flex-col-reverse gap-x-16 gap-y-8 min-[750px]:flex-row min-[750px]:justify-between">
        <div className="flex flex-col gap-y-16 flex-1 max-w-[680px] pb-10">
          <BrandingWelcome />
          <BrandingLogo />
          <BrandingClearspace />
          <BrandingBannedLogos />
          <BrandingColors />
          <BrandingAssets />
          <BrandingPress />
        </div>
        <div className="min-w-[240px] max-w-full min-[750px]:max-w-[240px] min-[750px]:[&>section]:sticky min-[750px]:[&>section]:top-12">
          <BrandingAnchorTags />
        </div>
      </div>

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
    </>
  );
}
