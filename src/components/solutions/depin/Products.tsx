import {
  ExternalLink,
  Wallet,
  Smartphone,
  GalleryVerticalEnd,
  Sparkles,
  Fullscreen,
  Box,
} from "lucide-react";
import { useTranslation } from "next-i18next";

const products = [
  {
    key: "wallets",
    Icon: Wallet,
    color: "text-emerald-400 bg-emerald-900/30",
    href: "#",
  },
  {
    key: "mobile",
    Icon: Smartphone,
    color: "text-indigo-400 bg-indigo-900/30",
    href: "#",
  },
  {
    key: "tokenization",
    Icon: Sparkles,
    color: "text-cyan-400 bg-cyan-900/30",
    href: undefined,
  },
  {
    key: "cnfts",
    Icon: GalleryVerticalEnd,
    color: "text-violet-400 bg-violet-900/30",
    href: "#",
  },
  {
    key: "zkcompression",
    Icon: Fullscreen,
    color: "text-blue-400 bg-blue-900/30",
    href: undefined,
  },
  {
    key: "tokenExtensions",
    Icon: Box,
    color: "text-emerald-400 bg-emerald-900/30",
    href: undefined,
  },
];

export const Products = () => {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
        {t("depin.products.title")}
        <span className="flex-1 border-t border-white/10 ml-4" />
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-1 pl-0">
        {products.map(({ key, Icon, color, href }) => {
          const hasLink = Boolean(href);
          const Content = (
            <>
              <div className="w-20 h-20 flex items-start md:mr-6 mb-4 md:mb-0">
                <div
                  className={`w-20 h-20 flex items-center justify-center rounded-xl text-2xl ${color}`}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-xl font-semibold">
                    {t(`depin.products.${key}.title`)}
                  </span>
                  {hasLink && (
                    <ExternalLink size={18} className="ml-1 text-white/60" />
                  )}
                </div>
                <p className="text-gray-300 mt-2 text-base">
                  {t(`depin.products.${key}.description`)}
                </p>
              </div>
            </>
          );

          return (
            <li key={key} className="group flex flex-col md:flex-row">
              {hasLink ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col md:flex-row"
                >
                  {Content}
                </a>
              ) : (
                <div className="group flex flex-col md:flex-row">{Content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
