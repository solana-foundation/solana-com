import React, { useMemo, useState } from "react";
import { Container } from "@/component-library/container";
import { cn } from "@/app/components/utils";
import MagicBrush from "@@/public/src/img/icons/MagicBrush.inline.svg";
import Statistics from "@@/public/src/img/icons/Statistics.inline.svg";
import Tasks from "@@/public/src/img/icons/Tasks.inline.svg";
import Todos from "@@/public/src/img/icons/Todos.inline.svg";
import FileText from "@@/public/src/img/icons/FileText.inline.svg";
import CodeFilled from "@@/public/src/img/icons/CodeFilled.inline.svg";
import ChevronLeft from "@@/public/src/img/icons/ChevronLeft.inline.svg";
import ChevronRight from "@@/public/src/img/icons/ChevronRight.inline.svg";
import SolanaMono from "@@/public/src/img/icons/SolanaMono.inline.svg";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

export const CATEGORIES = {
  all: {
    id: "all",
    name: "All",
    Icon: Tasks,
    color: "text-white",
  },
  reports: {
    id: "reports",
    name: "Reports",
    Icon: Statistics,
    color: "text-nd-highlight-lavendar",
  },
  developers: {
    id: "developers",
    name: "Developers",
    Icon: CodeFilled,
    color: "text-nd-highlight-orange",
  },
  solutions: {
    id: "solutions",
    name: "Solutions",
    Icon: Todos,
    color: "text-nd-highlight-gold",
  },
  caseStudies: {
    id: "caseStudies",
    name: "Case studies",
    Icon: FileText,
    color: "text-nd-highlight-green",
  },
  artists: {
    id: "artists",
    name: "Artists",
    Icon: MagicBrush,
    color: "text-nd-highlight-lime",
  },
};

const loadingItems = new Array(10).fill(null);

export type WhatsUpProps = {
  title?: React.ReactNode;
  items?: {
    index: number;
    title: string;
    categoryId: string;
    date: string;
  }[];
};

export const WhatsUp: React.FC<WhatsUpProps> = ({ title, items }) => {
  const t = useTranslations();
  const categories = useMemo(
    () =>
      Object.values(CATEGORIES).map((category) => ({
        ...category,
        name: t(`terminal.categories.${category.id}`),
      })),
    [t],
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0].id,
  );
  return (
    <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-twd-0">
      <div className="py-[64px] md:py-[108px] xl:py-[160px]">
        <Container className="flex flex-col justify-between relative">
          <div className="flex flex-col xl:flex-row gap-[52px] justify-between items-start">
            <div className="xl:max-w-[70%] grow-0">
              {title && <h2 className="nd-heading-l">{title}</h2>}
            </div>
          </div>
        </Container>
        <div className="border-t border-b border-nd-border-light mt-twd-10 xl:mt-twd-16">
          <Container>
            <div className="xl:border-l xl:border-r border-nd-border-light -mx-twd-5 md:-mx-twd-8 xl:mx-0 divide-x divide-nd-border-light flex flex-col xl:flex-row">
              <div className="xl:w-[220px] border-b xl:border-b-0 border-nd-border-light shrink-0 mb-twd-2 xl:mb-twd-0 overflow-hidden relative">
                <div className="h-16 px-twd-6 items-center justify-between flex gap-twd-3 border-b xl:border-b-0 border-nd-border-light mb-twd-2 xl:mb-twd-0">
                  <span className="font-brand-mono text-[14px] leading-[1.14] font-bold uppercase">
                    <SolanaMono className={cn("w-3 h-3 -mt-0.5 mr-[7px]")} />
                    TERMINAL
                  </span>
                  <div className="flex gap-twd-1">
                    {loadingItems.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-[1.5px] h-[13px]",
                          index === 0
                            ? "bg-nd-highlight-green shadow-[0_0_3.7px_0_rgba(0,248,174,0.82)]"
                            : "bg-nd-border-prominent",
                        )}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="h-48 p-twd-6 items-end justify-start hidden xl:flex border-t border-nd-border-light">
                  <span className="text-[28px] leading-[1.14] font-medium">
                    {t.rich("terminal.title", {
                      gray: (chunks) => (
                        <span className="text-nd-mid-em-text">
                          {chunks}
                          <br />
                        </span>
                      ),
                    })}
                  </span>
                </div>
                <div className="xl:divide-y xl:divide-nd-border-light grid grid-cols-3 xl:grid-cols-1 mr-[-1px] mb-[-1px] xl:mr-0 xl:mb-0 border-t xl:border-t-0 border-nd-border-light">
                  <div className="hidden xl:block h-0 xl:mb-[-1px]"></div>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={cn(
                        "p-twd-3 xl:px-twd-5 flex flex-col xl:flex-row items-start xl:items-center justify-start gap-twd-2.5 w-full xl:min-h-16 hover:bg-nd-border-light/20 relative",
                        "border-r border-b border-nd-border-light xl:border-b-0 xl:border-r-0",
                        activeCategory === category.id
                          ? "!bg-nd-primary !text-nd-inverse xl:before:absolute xl:before:top-1.5 xl:before:left-1.5 xl:before:bottom-1.5 xl:before:w-[3px] xl:before:bg-nd-inverse"
                          : "text-nd-mid-em-text",
                      )}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      disabled={activeCategory === category.id}
                    >
                      <category.Icon
                        className={cn(
                          "w-5 h-5 -mt-0.5",
                          activeCategory !== category.id && category.color,
                        )}
                      />
                      <span className="nd-body-l leading-[1.5]">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-nd-border-light border-t xl:border-t-0 border-nd-border-light grow overflow-hidden">
                {items?.map((item) => {
                  const category = CATEGORIES[item.categoryId];
                  const CategoryIcon = category?.Icon;
                  return (
                    <div
                      key={item.index}
                      className="flex flex-row gap-twd-4 xl:gap-twd-0 p-twd-4 xl:p-twd-0 w-full xl:min-h-16 divide-x divide-nd-border-light"
                    >
                      <div className="shrink-0 grow-0 xl:w-16 flex items-start xl:items-center justify-center">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-nd-border-light">
                          <span className="nd-body-s text-nd-mid-em-text pt-[1px]">
                            {item.index}
                          </span>
                        </div>
                      </div>
                      <div className="w-auto grow xl:px-twd-5 flex items-center justify-start min-w-0">
                        <div className="xl:text-ellipsis xl:text-nowrap overflow-hidden max-w-full nd-body-l leading-[1.5]">
                          {item.title}
                        </div>
                      </div>
                      <div className="shrink-0 grow-0 px-twd-5 hidden xl:flex items-center justify-start w-[180px]">
                        {CategoryIcon && (
                          <CategoryIcon
                            className={cn(
                              "w-4 h-4 mr-twd-2.5 -mt-0.5",
                              category?.color,
                            )}
                          />
                        )}
                        <span className="font-brand-mono font-medium text-[14px] leading-[1.42] uppercase">
                          {t(`terminal.categories.${item.categoryId}`)}
                        </span>
                      </div>
                      <div className="shrink-0 grow-0 px-twd-5 hidden xl:flex items-center justify-start w-[160px]">
                        <span className="font-brand-mono font-medium text-nd-mid-em-text text-[14px] leading-[1.42] uppercase">
                          {format(item.date, "MMM d yyyy")}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="h-0 mb-[-1px]"></div>
              </div>
              <div className="flex flex-1 flex-row divide-x divide-nd-border-light border-t border-nd-border-light xl:hidden">
                <button
                  className={cn(
                    "py-twd-3 px-twd-5 flex flex-col items-start justify-start gap-twd-2.5 w-full hover:bg-nd-border-light/20",
                  )}
                  type="button"
                >
                  <ChevronLeft className={cn("w-4 h-4 -mt-0.5")} />
                  <span className="nd-body-l leading-[1.5]">
                    {t("terminal.prevPage")}
                  </span>
                </button>
                <button
                  className={cn(
                    "py-twd-3 px-twd-5 flex flex-col items-end justify-end gap-twd-2.5 w-full hover:bg-nd-border-light/20",
                  )}
                  type="button"
                >
                  <ChevronRight className={cn("w-4 h-4 -mt-0.5")} />
                  <span className="nd-body-l leading-[1.5]">
                    {t("terminal.nextPage")}
                  </span>
                </button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
};
