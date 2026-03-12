import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/component-library/container";
import { cn } from "@/app/components/utils";
import MagicBrush from "@@/public/src/img/icons/MagicBrush.inline.svg";
import Statistics from "@@/public/src/img/icons/Statistics.inline.svg";
import Tasks from "@@/public/src/img/icons/Tasks.inline.svg";
import Bezier from "@@/public/src/img/icons/Bezier.inline.svg";
import FileText from "@@/public/src/img/icons/FileText.inline.svg";
import CodeFilled from "@@/public/src/img/icons/CodeFilled.inline.svg";
import ChevronLeft from "@@/public/src/img/icons/ChevronLeft.inline.svg";
import ChevronRight from "@@/public/src/img/icons/ChevronRight.inline.svg";
import SolanaMono from "@@/public/src/img/icons/SolanaMono.inline.svg";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button } from "@/app/components/ui/button";

dayjs.extend(utc);
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useTerminal } from "@/lib/terminal";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const CATEGORIES: Record<
  string,
  {
    id: string;
    name: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    bg: string;
  }
> = {
  all: {
    id: "all",
    name: "All",
    Icon: Tasks,
    color: "text-white",
    bg: "white",
  },
  defi: {
    id: "defi",
    name: "DeFi",
    Icon: Statistics,
    color: "text-nd-highlight-lavendar",
    bg: "#CA9FF5",
  },
  institutions: {
    id: "institutions",
    name: "Institutions",
    Icon: FileText,
    color: "text-nd-highlight-green",
    bg: "#55E9AB",
  },
  consumer: {
    id: "consumer",
    name: "Consumer",
    Icon: MagicBrush,
    color: "text-nd-highlight-lime",
    bg: "#CFF15E",
  },
  developers: {
    id: "developers",
    name: "Developers",
    Icon: CodeFilled,
    color: "text-nd-highlight-orange",
    bg: "#F48252",
  },
  ecosystem: {
    id: "ecosystem",
    name: "Ecosystem",
    Icon: Bezier,
    color: "text-nd-highlight-gold",
    bg: "#FFC526",
  },
};

export type WhatsUpProps = {
  title?: React.ReactNode;
  // items?: {
  //   index: number;
  //   title: string;
  //   categoryId: string;
  //   date: string;
  // }[];
  cta?: string;
  ctaHref?: string;
};

export const WhatsUp: React.FC<WhatsUpProps> = ({
  title,
  // items,
  cta,
  ctaHref,
}) => {
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
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  const { items, isLoading } = useTerminal({ category: activeCategory });
  const prevItemsRef = useRef<typeof items>([]);
  const [newItemIds, setNewItemIds] = useState<string[]>([]);
  const totalItems = items?.length || 0;
  const allNew = newItemIds.length >= totalItems;
  const [firstRender, setFirstRender] = useState(true);
  const [firstRenderItems, setFirstRenderItems] = useState<typeof items>([]);
  const [page, setPage] = useState(1);

  // useEffect(() => {
  //   if (!isIntersecting) return;
  //   setFirstRenderItems(items || []);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isIntersecting]);

  // useEffect(() => {
  //   if (!firstRender) return;
  //   setFirstRenderItems(items || []);
  // }, [firstRender, items]);

  useEffect(() => {
    if (!firstRender || !isIntersecting) return;

    setFirstRenderItems(items || []);

    const timer = setTimeout(() => {
      setFirstRender(false);
    }, 10000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRender, isIntersecting]);

  useEffect(() => {
    if (!items || items.length === 0) {
      prevItemsRef.current = items || [];
      setNewItemIds([]);
      // Reset to page 1 if no items
      setPage(1);
      return;
    }

    const prevItems = prevItemsRef.current;
    const prevItemIds = prevItems.map((item) => item.id);
    const newIds = items
      .filter((item) => !prevItemIds.includes(item.id))
      .map((item) => item.id);

    setNewItemIds(newIds);

    prevItemsRef.current = items;

    // Reset to page 1 if current page doesn't have enough items
    // (e.g., if we're on page 2 but only have 5 or fewer items)
    if (page === 2 && items.length <= 5) {
      setPage(1);
    }
  }, [items, page]);

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-0">
      <div className="py-10">
        <Container className="flex flex-col justify-between relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="xl:max-w-[70%] grow-0">
              {title && <h2 className="nd-heading-l">{title}</h2>}
            </div>
            {cta && (
              <div>
                <Button
                  className="h-12 w-auto nd-body-m"
                  asChild
                  variant="secondary-outline"
                  size="lg"
                  rounded
                >
                  <a
                    className="text-inherit"
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cta}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </Container>
        <div
          className="border-t border-b border-nd-border-light mt-10 xl:mt-16"
          ref={ref}
        >
          <Container>
            <div className="xl:border-l xl:border-r border-nd-border-light -mx-5 md:-mx-8 xl:mx-0 divide-x divide-nd-border-light flex flex-col xl:flex-row">
              <div className="xl:w-[220px] border-b xl:border-b-0 border-nd-border-light shrink-0 mb-2 xl:mb-0 overflow-hidden relative">
                <div
                  className={cn(
                    "h-16 px-6 items-center justify-between flex gap-3 border-b xl:border-b-0 border-nd-border-light mb-2 xl:mb-0",
                    { "animate-curtain-left-to-right": isIntersecting },
                  )}
                  style={
                    isIntersecting ? { animationDelay: `0s` } : { opacity: 0 }
                  }
                >
                  <span className="font-brand-mono text-[14px] leading-[1.14] font-bold uppercase flex items-center">
                    <SolanaMono className={cn("w-3 h-3 -mt-0.5 mr-[7px]")} />
                    TERMINAL
                  </span>
                  <div className="flex gap-1">
                    <div
                      className={cn("terminal-loader", {
                        animate: isLoading,
                      })}
                    ></div>
                  </div>
                </div>
                <div
                  className={cn(
                    "h-48 p-6 items-end justify-start hidden xl:flex border-t border-nd-border-light",
                    { "animate-curtain-left-to-right": isIntersecting },
                  )}
                  style={
                    isIntersecting ? { animationDelay: `0.2s` } : { opacity: 0 }
                  }
                >
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
                  {categories.map((category, index) => (
                    <button
                      key={category.id}
                      className={cn(
                        "p-3 xl:px-5 flex flex-col xl:flex-row items-start xl:items-center justify-start gap-2.5 w-full xl:min-h-16 hover:bg-nd-border-light/20 relative",
                        "border-r border-b border-nd-border-light xl:border-b-0 xl:border-r-0",
                        activeCategory === category.id
                          ? "!bg-nd-primary !text-nd-inverse xl:before:absolute xl:before:top-1.5 xl:before:left-1.5 xl:before:bottom-1.5 xl:before:w-[3px] xl:before:bg-nd-inverse"
                          : "text-nd-mid-em-text",
                        { "animate-curtain-top-to-bottom": isIntersecting },
                      )}
                      type="button"
                      onClick={() => {
                        setActiveCategory(category.id);
                        setPage(1);
                        setFirstRender(false);
                      }}
                      disabled={activeCategory === category.id}
                      style={
                        isIntersecting
                          ? { animationDelay: `${0.2 + index * 0.1}s` }
                          : { opacity: 0 }
                      }
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
              <div className="w-16 divide-y divide-nd-border-light border-t xl:border-t-0 border-nd-border-light grow-0 shrink-0 overflow-hidden relative hidden xl:block">
                {(firstRender ? firstRenderItems : items)?.map(
                  (item, index) => {
                    if (!isDesktop) {
                      if (page === 1 && index >= 5) return null;
                      if (page === 2 && index < 5) return null;
                    }

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex flex-row gap-4 xl:gap-0 p-4 xl:p-0 w-full xl:min-h-16 divide-x divide-nd-border-light",
                          {
                            "animate-stretch-in": isIntersecting && firstRender,
                          },
                        )}
                        style={
                          isIntersecting && firstRender
                            ? {
                                animationDelay: `${1 + (totalItems - index) * 0.15}s`,
                              }
                            : undefined
                        }
                      >
                        <div className="shrink-0 grow-0 xl:w-16 flex items-start xl:items-center justify-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-nd-border-light">
                            <span className="nd-body-s text-nd-mid-em-text pt-[1px]">
                              {item.index}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
                <div className="h-0 mb-[-1px]"></div>
              </div>
              <div className="divide-y divide-nd-border-light border-t xl:border-t-0 border-nd-border-light grow overflow-hidden relative">
                <AnimatePresence mode="popLayout" initial={false}>
                  {(firstRender ? firstRenderItems : items)?.map(
                    (item, index) => {
                      if (!isDesktop) {
                        if (page === 1 && index >= 5) return null;
                        if (page === 2 && index < 5) return null;
                      }

                      const category = CATEGORIES[item.categoryId];
                      const CategoryIcon = category?.Icon;
                      const isNewItem = newItemIds.includes(item.id);
                      const content = (
                        <>
                          <div className="shrink-0 grow-0 xl:w-16 flex xl:hidden items-start xl:items-center justify-center">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-nd-border-light">
                              <span className="nd-body-s text-nd-mid-em-text pt-[1px]">
                                {item.index}
                              </span>
                            </div>
                          </div>
                          <div className="w-auto grow xl:px-5 flex items-center justify-start min-w-0 xl:!border-l-0">
                            <div className="xl:text-ellipsis xl:text-nowrap overflow-hidden max-w-full nd-body-l leading-[1.5]">
                              {item.title}
                            </div>
                          </div>
                          <div className="shrink-0 grow-0 px-5 hidden xl:flex items-center justify-start w-[180px]">
                            {CategoryIcon && (
                              <CategoryIcon
                                className={cn(
                                  "w-4 h-4 mr-2.5 -mt-0.5",
                                  category?.color,
                                )}
                              />
                            )}
                            <span className="font-brand-mono font-medium text-[14px] leading-[1.42] uppercase">
                              {t(`terminal.categories.${item.categoryId}`)}
                            </span>
                          </div>
                          {/* Date temporarily removed
                          <div className="shrink-0 grow-0 px-5 hidden xl:flex items-center justify-start w-[160px]">
                            <span className="font-brand-mono font-medium text-nd-mid-em-text text-[14px] leading-[1.42] uppercase">
                              {item.date &&
                                dayjs
                                  .utc(item.date, "DD MMM YYYY")
                                  .format("MMM D YYYY")}
                            </span>
                          </div>
                          */}
                        </>
                      );

                      if (firstRender) {
                        return (
                          <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "flex flex-row gap-4 xl:gap-0 p-4 xl:p-0 w-full xl:min-h-16 xl:divide-x xl:divide-nd-border-light hover:bg-nd-border-light/10 transition-colors text-white cursor-pointer",
                              {
                                "animate-stretch-in": isIntersecting,
                              },
                            )}
                            style={
                              isIntersecting
                                ? {
                                    animationDelay: `${1 + (totalItems - index) * 0.15}s`,
                                  }
                                : {
                                    opacity: 0,
                                  }
                            }
                          >
                            {content}
                          </a>
                        );
                      }

                      return (
                        <motion.a
                          key={`${item.id}-${activeCategory}`}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{
                            duration: 0.2,
                            opacity: { duration: 0.1 },
                          }}
                          className={cn(
                            "flex flex-row gap-4 xl:gap-0 p-4 xl:p-0 w-full xl:min-h-16 xl:divide-x xl:divide-nd-border-light hover:bg-nd-border-light/10 transition-colors text-white cursor-pointer",
                            {
                              "animate-flash-background": isNewItem && !allNew,
                            },
                          )}
                          style={
                            {
                              "--flash-bg-color": category?.bg,
                            } as React.CSSProperties
                          }
                        >
                          {content}
                        </motion.a>
                      );
                    },
                  )}
                  <div className="h-0 mb-[-1px]"></div>
                </AnimatePresence>
              </div>
              <div className="flex flex-1 flex-row divide-x divide-nd-border-light border-t border-nd-border-light xl:hidden">
                <button
                  className={cn(
                    "py-3 px-5 flex flex-col items-start justify-start gap-2.5 w-full hover:bg-nd-border-light/20 disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                  type="button"
                  disabled={page === 1}
                  onClick={() => {
                    setPage(1);
                  }}
                >
                  <ChevronLeft className={cn("w-4 h-4 -mt-0.5")} />
                  <span className="nd-body-l leading-[1.5]">
                    {t("terminal.prevPage")}
                  </span>
                </button>
                <button
                  className={cn(
                    "py-3 px-5 flex flex-col items-end justify-end gap-2.5 w-full hover:bg-nd-border-light/20 disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                  type="button"
                  disabled={page === 2 || items?.length <= 5}
                  onClick={() => {
                    setPage(2);
                  }}
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
