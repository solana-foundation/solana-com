import { Check } from "lucide-react";
import { useTranslation } from "next-i18next";

export const WhatIsDepin = () => {
  const { t } = useTranslation("common");

  return (
    <section className="w-full py-10 md:py-20 flex justify-center">
      <div className="flex flex-col items-center max-w-5xl w-full px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          {t("depin.features.title")}
        </h2>
        <p className="text-lg text-[#B0B8C1] mb-8 max-w-xl text-center">
          {t("depin.features.description")}
        </p>
        <ul className="flex flex-col md:flex-row flex-wrap gap-4 pl-0 justify-center">
          <FeatureCheck text={t("depin.features.fast")} />
          <FeatureCheck text={t("depin.features.decentralized")} />
          <FeatureCheck text={t("depin.features.communityFirst")} />
        </ul>
      </div>
    </section>
  );
};

const FeatureCheck = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2">
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0f533d]">
      <Check
        className="w-4 h-4 text-[#1eff9b]"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </span>
    <span className="text-base text-[#B0B8C1]">{text}</span>
  </li>
);
