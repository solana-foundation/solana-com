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
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-1 pl-0">
        {products.map(({ key, Icon, color, href }) => {
          const hasLink = Boolean(href);
          const productTitle = t(`${translationBase}.${key}.title`);
          const productDescription = t(`${translationBase}.${key}.description`);
          const Content = (
            <>
              <div className="w-20 h-20 flex items-start md:mr-6 mb-4 md:mb-0">
                <div
                  className={`w-20 h-20 flex items-center justify-center rounded-xl text-2xl ${color}`}
                >
                  <Icon size={20} aria-hidden={true} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-xl font-semibold">
                    {productTitle}
                  </span>
                  {hasLink && (
                    <ExternalLink size={18} className="ml-1 text-white/60" />
                  )}
                </div>
                <p className="text-gray-300 mt-2 text-base">
                  {productDescription}
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
