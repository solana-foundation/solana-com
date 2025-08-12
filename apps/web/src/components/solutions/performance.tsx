import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export type PerformanceItem = {
  key?: string;
  Icon: React.ComponentType<{
    size?: number;
    "aria-hidden"?: boolean;
    strokeWidth?: number;
  }>;
  color: string;
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
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4 md:pb-4">
          {title}
        </h2>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6 md:gap-y-10 md:gap-x-12 pl-0">
        {items.map(({ key, Icon, color }, index) => {
          // If there is no key, it is an icon item
          if (!key) {
            return (
              <li
                className={`p-2.5 list-none ${color} w-full`}
                key={`item-${index}`}
              >
                <div
                  className={`bg-current p-4 flex items-center justify-center h-full`}
                >
                  <div className={`p-2 rounded-full ${color}`}>
                    <Icon size={56} aria-hidden={true} strokeWidth={2.5} />
                  </div>
                </div>
              </li>
            );
          }

          const productTitle = t(`${translationBase}.${key}.title`);
          const productDescription = t(`${translationBase}.${key}.description`);

          return (
            <li
              key={key}
              className="group flex flex-row rounded-xl transition hover:border-white/20 w-full"
            >
              <div className="group flex flex-row justify-stretch w-full">
                <div
                  className={`w-12 shrink-0 flex justify-center pt-2.5 ${color}`}
                >
                  <Icon size={40} aria-hidden={true} strokeWidth={1} />
                </div>
                <div className="bg-[#212B3E] py-4 pl-2 pr-4 grow">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-lg md:text-2xl !leading-none font-semibold">
                      {productTitle}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2 text-sm md:text-base">
                    {productDescription}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
