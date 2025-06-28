// src/components/solutions/depin/LatestNews.tsx
import Link from "next/link";
import React from "react";

const news = [
  {
    id: 1,
    title: "Gradient Network raises $10M for AI DePIN",
    date: "May 12",
    image: "/img/og-backgrounds/shape-1.jpg",
    large: true,
    link: "#",
  },
  {
    id: 2,
    title: "Helium hits new milestones in wireless DePIN",
    date: "May 12",
    image: "/img/og-backgrounds/shape-2.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Natix teams up with Grab for global DePIN mapping",
    date: "May 12",
    image: "/img/og-backgrounds/shape-3.jpg",
    link: "#",
  },
  {
    id: 4,
    title: "Lyft to use decentralized maps provided by Hivemapper",
    date: "May 12",
    image: "/img/og-backgrounds/shape-4.jpg",
    link: "#",
  },
];

export const LatestNews = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-white mb-8">Latest News</h2>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
      <div className="md:col-span-3 flex flex-col">
        <Link
          href={news[0].link}
          className="flex flex-col rounded-lg transition hover:bg-[#23272f] p-2 group mb-3"
        >
          <div className="w-full rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={news[0].image}
              alt={news[0].title}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="mt-4">
            <div className="text-[#8A8F98] font-medium text-sm mb-2 uppercase tracking-wide">
              {news[0].date}
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:underline">
              {news[0].title}
            </h3>
          </div>
        </Link>
      </div>
      <div className="md:col-span-3 flex flex-col gap-6">
        {news.slice(1).map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="flex gap-4 rounded-lg transition hover:bg-[#23272f] p-2 group"
          >
            <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[#8A8F98] font-medium text-xs mb-1 uppercase tracking-wide">
                {item.date}
              </div>
              <h4 className="text-lg font-semibold text-white leading-snug group-hover:underline">
                {item.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <hr className="mt-10 border-[#919191]" />
  </div>
);
