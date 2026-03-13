import { getTranslations } from "next-intl/server";
import { getMiamiSpeakers } from "@/lib/miami-speakers";
import { MiamiSpeakersCarousel } from "./MiamiSpeakersCarousel";

type MiamiSpeakersProps = {
  locale: string;
};

export async function MiamiSpeakers({ locale }: MiamiSpeakersProps) {
  const [t, speakers] = await Promise.all([
    getTranslations({ locale, namespace: "accelerate.speakers" }),
    getMiamiSpeakers(),
  ]);

  return <MiamiSpeakersCarousel heading={t("heading")} speakers={speakers} />;
}
