import { ChevronRight, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType, ReactNode } from "react";

export type Product = {
  key: string;
  Icon: ComponentType<{
    size?: string | number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  color: string;
  href?: string;
};

type ProductsProps = {
  title?: ReactNode;
  description?: ReactNode;
  products: Product[];
  translationBase: string;
};

/**
 * Displays a grid of products with a title and description.
 *
 * @component
 * @param {ProductsProps} props - The props for the component.
 * @param {Product[]} props.products - The products to display in the grid.
 * @param {string} props.title - The title of the products.
 * @param {string} props.description - The description of the products.
 * @param {string} props.translationBase - The base translation key for the products.
 * @returns {JSX.Element} The rendered Products component.
 *
 * @example
 * <Products
 *   products={[{
 *     key: "1",
 *     Icon: Icon,
 *     color: "text-emerald-400 bg-emerald-900/30",
 *     href: "https://example.com"
 *   }]}
 *   translationBase="products"
 * />
 */
export const Products = ({
  products,
  title,
  description,
  translationBase,
}: ProductsProps) => {
  const t = useTranslations();
  return (
    <section className="relative bg-black text-white text-left">
      <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="w-full xl:w-2/5">
          {(title || description) && (
            <div className="mb-[32px] xl:mb-[48px]">
              {title && (
                <h2 className="font-brand font-medium leading-none text-[32px] md:text-[40px] xl:text-[64px] mb-0">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[#ABABBA] text-lg md:text-2xl mt-6 mb-0">
                  {description}
                </p>
              )}
            </div>
          )}
          <ul className="p-0 m-0 list-none divide-y-[1px] divide-white/10">
            {products.map(({ key, href }) => {
              const hasLink = Boolean(href);
              const productTitle = t(`${translationBase}.${key}.title`);
              const productDescription = t(
                `${translationBase}.${key}.description`,
              );

              const content = (
                <>
                  <div className="mr-4 leading-4 md:leading-6">
                    <Copy size={16} aria-hidden={true} />
                  </div>
                  <div className="grow">
                    <p className="font-medium mb-0 text-base md:text-2xl">
                      {productTitle}
                    </p>
                    <p className="text-[#ABABBA] mt-2 mb-0 text-base md:text-lg xl:text-xl">
                      {productDescription}
                    </p>
                  </div>
                  <div className="leading-4 md:leading-6">
                    {hasLink && (
                      <ChevronRight
                        className="text-[#ABABBA] group-hover:text-white"
                        size={22}
                        aria-hidden={true}
                      />
                    )}
                  </div>
                </>
              );

              return (
                <li key={key} className="p-0">
                  {hasLink ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-row w-fulll p-[12px_0] xl:p-[24px_12px] text-inherit focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex flex-row w-full p-[12px_0] xl:p-[24px_12px]">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
