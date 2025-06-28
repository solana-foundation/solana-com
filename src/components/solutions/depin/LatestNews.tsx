// src/components/solutions/depin/LatestNews.tsx
import Link from "next/link";
import React from "react";
import Image from "next/image";

const news = [
  {
    id: 1,
    title: "Natix Teams Up with Grab",
    date: "May 6",
    image: "/src/img/solutions/depin/news/natix-grab.avif",
    large: true,
    link: "https://www.coindesk.com/tech/2025/05/06/solanas-natix-and-grab-team-up-to-expand-depin-mapping-into-us-europe",
  },
  {
    id: 2,
    title: "Lyft taps Hivemapper for Decentralized Data Mapping",
    date: "May 15",
    image: "/src/img/solutions/depin/news/lyft.webp",
    link: "https://decrypt.co/320127/rideshare-company-lyft-taps-bee-maps-decentralized-mapping-data",
  },
  {
    id: 3,
    title: "AT&T use Helium hotspots in new commercial agreement",
    date: "April 24",
    image: "/src/img/solutions/depin/news/helium.webp",
    link: "https://www.theblock.co/post/351856/att-subscribers-will-now-automatically-connect-to-nearby-helium-hotspots-through-new-commercial-agreement",
  },
  {
    id: 4,
    title:
      "Mike Horton, Project Creator of GEODNET, Testifies Before U.S. Congress",
    date: "April 19",
    image: "/src/img/solutions/depin/news/mike-horton.webp",
    link: "https://x.com/geodnet_/status/1913329186317779239",
  },
];

export const LatestNews = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-white mb-8">Latest News</h2>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
      <div className="md:col-span-3 flex flex-col">
        <Link
          href={news[0].link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col rounded-lg transition hover:bg-[#23272f] p-2 group mb-3"
        >
          <div className="w-full rounded-lg overflow-hidden flex-shrink-0 relative h-64">
            <Image
              src={news[0].image}
              alt={news[0].title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
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
