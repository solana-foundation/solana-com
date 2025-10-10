import { cn } from "@/app/components/utils";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";

export type PerformanceItem = {
  key?: string;
};

type PerformanceProps = {
  title?: ReactNode;
  items: PerformanceItem[];
  translationBase: string;
};

export const Performance = ({
  items,
  title,
  translationBase,
}: PerformanceProps) => {
  const t = useTranslations();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <section className="relative bg-black text-white text-left font-brand">
      <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row max-xl:gap-6 xl:gap-20">
        <div className={cn("w-full xl:w-1/2")}>
          {title && (
            <h2 className="font-brand font-medium leading-none text-[32px] md:text-[40px] xl:text-[64px] mb-[32px] xl:mb-[48px]">
              {title}
            </h2>
          )}
        </div>
        <div className="w-full xl:w-1/2">
          <ul className="pl-0">
            {items.map(({ key }, index) => {
              const productTitle = t(`${translationBase}.${key}.title`);
              const productDescription = t(
                `${translationBase}.${key}.description`,
              );
              const isExpanded = expandedItems.has(key || "");

              return (
                <li key={key} className="group flex flex-col list-none w-full">
                  <div
                    className={cn(
                      "box-border content-stretch flex gap-[18px] items-start px-0 py-[20px] relative shrink-0 w-full cursor-pointer transition-all duration-200 ",
                      {
                        "border-t border-white/10": index !== 0,
                      },
                    )}
                    onClick={() => key && toggleExpanded(key)}
                  >
                    <div className="xl:w-8 xl:h-8 max-xl:w-6 max-xl:h-6 md:mt-0 shrink-0 grow-0 bg-none rounded-full flex items-center justify-center text-white border-[1px] border-white group-hover:bg-white group-hover:!text-black transition-all duration-200">
                      <span className="text-sm font-medium leading-8">
                        {index + 1}
                      </span>
                    </div>
                    <div className="basis-0 grow shrink-0">
                      <p className="font-medium mb-0 font-brand text-lg md:text-2xl">
                        {productTitle}
                      </p>
                      <div className="overflow-hidden transition-all duration-300 ease-in-out">
                        <p
                          className={cn(
                            "text-[#ABABBA] font-brand text-lg md:text-2xl mb-0 mt-1 transition-all duration-300",
                            isExpanded
                              ? "opacity-100 max-h-96"
                              : "opacity-60 max-h-0",
                          )}
                        >
                          {productDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
