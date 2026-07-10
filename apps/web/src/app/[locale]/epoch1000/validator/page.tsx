import ValidatorEpoch1000Experience from "@/components/epoch1000/ValidatorEpoch1000Experience";
import Epoch1000EditionNav from "@/components/epoch1000/Epoch1000EditionNav";
import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

type Props = { params: Promise<{ locale: string }> };

const VALIDATOR_PATH = "/epoch1000/validator";
const VALIDATOR_SOCIAL_IMAGE =
  "/api/epoch1000/og?s=1000&fe=0&c=1000&k=validator";

export default async function Page() {
  const t = await getTranslations("epoch1000.validator.page");
  const nav = await getTranslations("epoch1000.page");

  return (
    <main className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12 flex flex-col gap-10 sm:gap-14 min-h-screen">
      <header className="flex justify-end border-b border-ep-edge/70 pb-4">
        <Epoch1000EditionNav
          active="validator"
          walletLabel={nav("navWallet")}
          validatorLabel={nav("navValidator")}
        />
      </header>

      <ValidatorEpoch1000Experience
        title={t.rich("title", {
          gradient: (chunks) => (
            <span className="text-sol-gradient">{chunks}</span>
          ),
        })}
        subtitle={t("subtitle")}
        description={t("description")}
      />
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("epoch1000.validator.meta");
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates(VALIDATOR_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      type: "website",
      url: alternates.canonical,
      images: [
        {
          url: VALIDATOR_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [VALIDATOR_SOCIAL_IMAGE],
    },
  };
}
