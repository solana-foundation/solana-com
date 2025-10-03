import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/app/components/utils";

export type Product = {
  key: string;
  color: string;
  href?: string;
};

type ProductsProps = {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  products: Product[];
  translationBase: string;
  imageSrc?: string;
  highlightColor?: string;
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
 * @param {string} props.imageSrc - The source of the image.
 * @param {string} props.highlightColor - The color of the highlight.
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
  className,
  products,
  title,
  description,
  translationBase,
  imageSrc,
  highlightColor = "#fff",
}: ProductsProps) => {
  const t = useTranslations();
  const { ref: productsRef, isIntersecting } =
    useIntersectionObserver<HTMLUListElement>({
      threshold: 0.2,
      triggerOnce: true,
    });

  return (
    <section
      className={cn("relative text-white text-left overflow-hidden", className)}
    >
      <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row max-md:gap-8 md:gap-16">
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
          <ul
            ref={productsRef}
            className="p-0 m-0 list-none divide-y-[1px] divide-white/10"
          >
            {products.map(({ key, href }, index) => {
              const hasLink = Boolean(href);
              const productTitle = t(`${translationBase}.${key}.title`);
              const productDescription = t(
                `${translationBase}.${key}.description`,
              );

              const content = (
                <>
                  <div
                    className="mr-4 leading-4 md:leading-6 group-hover:text-[var(--highlight-color)]"
                    style={
                      {
                        "--highlight-color": highlightColor,
                      } as React.CSSProperties
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d="M8 0V8H16V16H8V8H0V0H8Z" fill="currentColor" />
                    </svg>
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
                <li
                  key={key}
                  className={cn("p-0", {
                    "animate-fade-in-up": isIntersecting,
                  })}
                  style={
                    isIntersecting
                      ? { animationDelay: `${0.1 + index * 0.1}s` }
                      : { opacity: 0 }
                  }
                >
                  {hasLink ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-row w-full p-[12px_0] xl:p-[24px_12px] text-inherit focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
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
        {imageSrc && (
          <div className="w-full xl:w-3/5">
            <Image
              className="max-w-[110%] h-auto object-contain"
              src={imageSrc}
              alt=""
              width={1000}
              height={1000}
            />
          </div>
        )}
      </div>
    </section>
  );
};
