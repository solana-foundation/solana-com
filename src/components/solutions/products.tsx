import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type Product = {
  key: string;
  Icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  color: string;
  href?: string;
};

type ProductsProps = {
  title?: ReactNode;
  description?: ReactNode;
  products: Product[];
  translationBase: string;
};

export const Products = ({
  products,
  title,
  description,
  translationBase,
}: ProductsProps) => {
  const t = useTranslations();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
          {title}
          <span className="flex-1 border-t border-white/10 ml-4" />
        </h2>
      )}
      {description && (
        <p className="text-[#B0B8C1] text-lg pb-5">{description}</p>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 md:gap-6 pl-0">
        {products.map(({ key, Icon, color, href }) => {
          const hasLink = Boolean(href);
          const productTitle = t(`${translationBase}.${key}.title`);
          const productDescription = t(`${translationBase}.${key}.description`);
          const Content = (
            <>
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-start mr-6 mb-4 md:mb-0">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl text-2xl ${color}`}
                >
                  <Icon size={24} aria-hidden={true} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-lg md:text-xl font-semibold">
                    {productTitle}
                  </span>
                  {hasLink && (
                    <ExternalLink size={18} className="ml-1 text-white/60" />
                  )}
                </div>
                <p className="text-gray-300 mt-2 text-sm md:text-base">
                  {productDescription}
                </p>
              </div>
            </>
          );

          return (
            <li
              key={key}
              className="group flex flex-row rounded-xl p-4 md:p-6 transition hover:border-white/20"
            >
              {hasLink ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-row focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
                >
                  {Content}
                </a>
              ) : (
                <div className="group flex flex-row">{Content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
