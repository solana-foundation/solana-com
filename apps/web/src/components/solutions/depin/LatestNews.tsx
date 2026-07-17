import Link from "next/link";
import React from "react";
import Image from "next/image";

export type NewsItem = {
  id: string;
  title: string;
  date?: string;
  image: string;
  link: string;
  large?: boolean;
};

export type LatestNewsProps = {
  title: string;
  items: NewsItem[];
};

export const LatestNews = ({ title, items }: LatestNewsProps) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
      <div className="md:col-span-3 flex flex-col">
        <Link
          href={items[0].link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col rounded-lg transition hover:bg-[#23272f] p-2 group mb-3"
        >
          <div className="w-full rounded-lg overflow-hidden flex-shrink-0 relative h-64">
            <Image
              src={items[0].image}
              alt={items[0].title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4">
            {items[0].date && (
              <div className="text-[#8A8F98] font-medium text-sm mb-2 uppercase tracking-wide">
                {items[0].date}
              </div>
            )}
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:underline">
              {items[0].title}
            </h3>
          </div>
        </Link>
      </div>
      <div className="md:col-span-3 flex flex-col gap-6">
        {items.slice(1).map((item) => (
          <Link
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 rounded-lg transition hover:bg-[#23272f] p-2 group"
          >
            <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="128px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              {item.date && (
                <div className="text-[#8A8F98] font-medium text-xs mb-1 uppercase tracking-wide">
                  {item.date}
                </div>
              )}
              <h4 className="text-lg font-semibold text-white leading-snug group-hover:underline">
                {item.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);
