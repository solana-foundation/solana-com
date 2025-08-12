import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type NewsItem = {
  id: string;
  title: string;
  date?: string;
  image: string;
  link: string;
  large?: boolean;
};

export type NewsProps = {
  items: NewsItem[];
};

const SmallNewsCard = ({ item }: { item: NewsItem }) => (
  <Link
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group block focus:outline-none"
  >
    <article
      className="
        h-[150px] flex flex-col rounded-lg overflow-hidden transition
      hover:shadow-lg focus:shadow-lg hover:scale-[1.01] focus:scale-[1.01]
        ring-0 group-focus-visible:ring-2 group-focus-visible:ring-[#6c47ff]
      "
      tabIndex={-1}
    >
      <div className="relative h-[100px] w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="py-3 flex-1 flex">
        <h3 className="text-lg font-semibold text-white leading-snug line-clamp-2 group-hover:underline group-focus:underline">
          {item.title}
        </h3>
      </div>
    </article>
  </Link>
);

const LargeNewsCard = ({ item }: { item: NewsItem }) => (
  <Link
    href={item.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group block focus:outline-none"
  >
    <article
      className="
        h-full min-h-[30rem] flex flex-col rounded-lg overflow-hidden transition
        hover:shadow-lg focus:shadow-lg hover:scale-[1.01] focus:scale-[1.01]
        ring-0 group-focus-visible:ring-2 group-focus-visible:ring-[#6c47ff]
      "
      tabIndex={-1}
    >
      <div className="relative h-72 w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="py-5 flex-1 flex flex-col gap-3 bg-transparent">
        <h3 className="text-2xl font-bold text-white leading-tight group-hover:underline group-focus:underline">
          {item.title}
        </h3>
      </div>
    </article>
  </Link>
);

export const News = ({ items }: NewsProps) => {
  const t = useTranslations();

  const col1 = items.slice(0, 1);
  const col2 = items.slice(1, 4);
  const col3 = items.slice(4, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white col-span-full mb-6">
        {t("btcfi.news.title")}
      </h2>
      {/* Mobile: single column (all small cards) */}
      <div className="md:hidden flex flex-col gap-4">
        {items.map((item) => (
          <SmallNewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Desktop: 3 columns. Column 1 large card; Columns 2-3 small cards */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-6">
          {col1.map((item) => (
            <LargeNewsCard key={item.id} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {col2.map((item) => (
            <SmallNewsCard key={item.id} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {col3.map((item) => (
            <SmallNewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
