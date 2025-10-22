import {
  ExternalLink,
  Wallet,
  Smartphone,
  Sparkles,
  Fullscreen,
  Box,
} from "lucide-react";
import { useTranslations } from "next-intl";

const products = [
  {
    key: "wallets",
    Icon: Wallet,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "/wallets",
  },
  {
    key: "mobile",
    Icon: Smartphone,
    color: "text-indigo-400 bg-indigo-900/30",
    href: "https://docs.solanamobile.com/",
  },
  {
    key: "tokenization",
    Icon: Sparkles,
    color: "text-cyan-400 bg-cyan-900/30",
    href: "/solutions/real-world-assets",
  },
  {
    key: "zkcompression",
    Icon: Fullscreen,
    color: "text-blue-400 bg-blue-900/30",
    href: "https://www.zkcompression.com/",
  },
  {
    key: "tokenExtensions",
    Icon: Box,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "/solutions/token-extensions",
  },
];

export const Products = () => {
  const t = useTranslations();

  return (
    <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
      <h2 className="flex gap-4 items-center mb-6 text-3xl font-bold text-white">
        {t("depin.products.title")}
        <span className="flex-1 ml-4 border-t border-white/10" />
      </h2>
      <p className="text-[#B0B8C1] text-lg pb-5">
        {t("depin.products.description")}
      </p>
      <ul className="grid grid-cols-1 gap-1 pl-0 md:grid-cols-3">
        {products.map(({ key, Icon, color, href }) => {
          const hasLink = Boolean(href);
          const Content = (
            <>
              <div className="flex items-start mb-4 w-20 h-20 md:mr-6 md:mb-0">
                <div
                  className={`flex justify-center items-center w-20 h-20 text-2xl rounded-xl ${color}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>
              </div>
              <div>
                <div className="flex gap-1 items-center">
                  <span className="text-xl font-semibold text-white">
                    {t(`depin.products.${key}.title`)}
                  </span>
                  {hasLink && (
                    <ExternalLink size={18} className="ml-1 text-white/60" />
                  )}
                </div>
                <p className="mt-2 text-base text-gray-300">
                  {t(`depin.products.${key}.description`)}
                </p>
              </div>
            </>
          );

          return (
            <li key={key} className="flex flex-col group md:flex-row">
              {hasLink ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col group md:flex-row"
                >
                  {Content}
                </a>
              ) : (
                <div className="flex flex-col group md:flex-row">{Content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
