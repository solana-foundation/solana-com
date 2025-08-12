import React from "react";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type BannerCTAProps = {
  href: string;
  label: string;
  description: React.ReactNode;
  image: string;
};

const BannerCTA = ({ href, label, description, image }: BannerCTAProps) => (
  <Link
    href={href}
    className="relative group flex-1 rounded-sm py-6 px-4 flex flex-col justify-between shadow-md border-2 border-[#35344a] hover:border-[#7b47ff] transition overflow-hidden"
  >
    {/* Background image */}
    <Image
      src={image}
      alt=""
      fill
      className="object-cover z-0"
      style={{ pointerEvents: "none" }}
      priority={false}
    />
    {/* Optional overlay for readability */}
    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
    <ArrowRightIcon
      className="text-[#a084ff] absolute top-1 right-1 transform rotate-[-45deg] group-hover:translate-x-1 transition z-20"
      size={16}
    />
    <div className="text-center relative z-20">
      <span className="text-base font-bold text-white">{label}</span>
      <div className="mt-2 text-white/80 text-xs text-center">
        {description}
      </div>
    </div>
  </Link>
);

export const CTACards = () => {
  const t = useTranslations();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 [padding-block:1rem] sm:[padding-block:2rem] sm:[padding-bottom:4rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#303742] rounded-2xl flex flex-col shadow-lg max-h-[400px] pt-6 px-6 pb-0 overflow-hidden">
          <h4 className="text-2xl font-semibold text-white mb-3">
            {t("btcfi.cta.learnTitle")}
          </h4>
          <p className="text-white/80 mb-6">
            {t("btcfi.cta.learnDescription")}
          </p>
          <div className="flex flex-col gap-3 mb-6">
            <Link
              href="/learn/introduction-to-solana-tokens"
              className="text-white flex items-center gap-1 hover:underline transition text-sm"
            >
              {t("btcfi.cta.learnTokens")}
              <ArrowRightIcon size={18} />
            </Link>
            <Link
              href="/learn/what-is-a-wallet"
              className="text-white flex items-center gap-1 hover:underline transition text-sm"
            >
              {t("btcfi.cta.learnWallets")}
              <ArrowRightIcon size={16} />
            </Link>
            <div className="flex flex-col h-full justify-end items-end mt-6">
              <Link
                href="/learn"
                className="text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base hover:bg-[#2a223d] outline outline-2 outline-[#7b47ff] outline-offset-[-2px]"
              >
                {t("btcfi.cta.startLearning")}
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[#212030] rounded-2xl p-6 flex flex-col shadow-lg min-h-[280px]">
          <h4 className="text-2xl font-semibold text-white mb-3">
            {t("btcfi.cta.whatElseTitle")}
          </h4>
          <p className="text-white/80 mb-6">
            {t("btcfi.cta.whatElseDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <BannerCTA
              href="/solutions/solana-permissioned-environments"
              label={t("btcfi.cta.items.0.label")}
              description={t.rich("btcfi.cta.items.0.description", {
                br: () => <br />,
              })}
              image="/src/img/solutions/icm/depin-cta.webp"
            />
            <BannerCTA
              href="/solutions/digital-assets"
              label={t("btcfi.cta.items.1.label")}
              description={t.rich("btcfi.cta.items.1.description", {
                br: () => <br />,
              })}
              image="/src/img/solutions/icm/wallets-cta.webp"
            />
            <BannerCTA
              href="/solutions/real-world-assets"
              label={t("btcfi.cta.items.2.label")}
              description={t.rich("btcfi.cta.items.2.description", {
                br: () => <br />,
              })}
              image="/src/img/solutions/icm/payments-cta.webp"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
