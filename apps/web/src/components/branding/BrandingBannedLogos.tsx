import Image from "next/image";
import { useTranslations } from "next-intl";

import InvalidMark from "../../../public/src/img/icons/RedClose.inline.svg";

const BANNED_LOGOS = [
  {
    src: "/src/img/branding/bannedLogos-1.svg",
    background: "#9945FF",
    descKey: "branding.banned.shadow",
  },
  {
    src: "/src/img/branding/bannedLogos-2.png",
    background: "#9945FF",
    descKey: "branding.banned.outline",
  },
  {
    src: "/src/img/branding/bannedLogos-3.svg",
    descKey: "branding.banned.stretch",
  },
  {
    src: "/src/img/branding/bannedLogos-4.svg",
    descKey: "branding.banned.lowResolution",
  },
  {
    src: "/src/img/branding/bannedLogos-5.svg",
    descKey: "branding.banned.imagery",
  },
  {
    src: "/src/img/branding/bannedLogos-6.svg",
    background: "#6D86D1",
    descKey: "branding.banned.contrast",
  },
];

const BrandingBannedLogos = () => {
  const t = useTranslations();

  return (
    <section className="mt-8">
      <div className="h6 font-bold">{t("branding.banned.title")}</div>
      <p className="small mt-2 mb-4">{t("branding.banned.description")}</p>
      <div className="flex justify-between gap-x-6 gap-y-6 flex-wrap">
        {BANNED_LOGOS.map(({ src, background, descKey }) => (
          <div
            key={src}
            className="relative flex items-center justify-center flex-1 w-full min-w-[280px] h-[180px] bg-white rounded-xl mb-6"
            style={background ? { background } : undefined}
          >
            <Image
              alt=""
              src={src}
              fill
              style={{ objectFit: "contain", padding: "1rem" }}
            />
            <InvalidMark className="absolute left-2 bottom-2" />
            <p className="absolute text-sm top-[calc(100%+0.5rem)] left-0">
              {t(descKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandingBannedLogos;
