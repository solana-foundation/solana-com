import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FormattedDate } from "../SolFormattedMessage";
import { cn } from "@/app/components/utils";

export type NewsItem = {
  id: string;
  title: string;
  date?: string;
  image: string;
  link: string;
  large?: boolean;
};

export type LatestNewsProps = {
  title: React.ReactNode;
  items: NewsItem[];
};

/**
 * Displays a grid of news items with a title.
 *
 * @component
 * @param {LatestNewsProps} props - The props for the component.
 * @param {React.ReactNode} props.title - The title of the news grid.
 * @param {NewsItem[]} props.items - The news items to display in the grid.
 * @returns {JSX.Element} The rendered LatestNews component.
 *
 * @example
 * <LatestNews
 *   title="Latest News"
 *   items={[{
 *     id: "1",
 *     title: "News Title",
 *     date: "2021-01-01",
 *     image: "https://example.com/image.jpg",
 *     link: "https://example.com/news"
 *   }]}
 * />
 */
export const LatestNews = ({ title, items }: LatestNewsProps) => {
  if (items.length === 0) {
    return null;
  }

  const isOneItem = items.length === 1;

  return (
    <section className="relative bg-black text-white text-left font-brand">
      <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row max-xl:gap-6 xl:gap-20">
        <div className={cn("w-full", isOneItem ? "xl:w-full" : "xl:w-7/12")}>
          {title && (
            <h2 className="font-brand font-medium leading-none text-[32px] md:text-[40px] xl:text-[64px] mb-[32px] xl:mb-[48px] tracking-[-2.56px]">
              {title}
            </h2>
          )}
          <div className="flex flex-col">
            <Link
              href={items[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-inherit group"
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group">
                <Image
                  src={items[0].image}
                  alt={items[0].title}
                  fill
                  className="object-cover z-0"
                />
              </div>
              <div className="mt-4 xl:mt-6">
                {items[0].date && (
                  <div className="text-[#ABABBC] text-sm md:text-base mb-1 uppercase tracking-wide">
                    <FormattedDate
                      value={new Date(items[0].date)}
                      month="short"
                      day="numeric"
                    />
                  </div>
                )}
                <h3 className="text-lg md:text-3xl xl:text-4xl font-semibold mt-0 mb-0 group-hover:underline tracking-[-1.08px]">
                  {items[0].title}
                </h3>
              </div>
            </Link>
          </div>
        </div>
        {!isOneItem && (
          <div className="w-full xl:w-5/12">
            <div className="flex flex-col divide-y-[1px] divide-white/10">
              {items.slice(1).map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 group text-inherit max-xl:py-4 xl:py-6"
                >
                  <div className="w-24 xl:w-44 aspect-video rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="177px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    {item.date && (
                      <div className="text-[#ABABBC] text-sm md:text-base mb-1 uppercase tracking-wide">
                        <FormattedDate
                          value={new Date(item.date)}
                          month="short"
                          day="numeric"
                        />
                      </div>
                    )}
                    <h4 className="text-base md:text-2xl font-medium group-hover:underline mb-0 tracking-[-0.72px]">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
