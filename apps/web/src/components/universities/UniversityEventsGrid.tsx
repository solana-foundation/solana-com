"use client";

import React from "react";
import UniversityEventCard from "./UniversityEventCard";
import { useTranslations } from "next-intl";
import GradientOrbs, { orbPresets } from "./GradientOrbs";

const universityEvents = [
  {
    id: "berkeley-2025",
    titleKey: "berkeley",
    location: "Berkeley",
    university: "UC Berkeley",
    date: "Sept 24",
    href: "https://lu.ma/f25ucb",
    image:
      "https://images.unsplash.com/photo-1694391505705-7fde96f6f14f?q=80&w=2000",
  },
  {
    id: "mhacks-2025",
    titleKey: "mhacks",
    location: "Ann Arbor",
    university: "MHacks",
    date: "Sept 27-28",
    href: "https://www.mhacks.org/",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000",
  },
  {
    id: "ucla-2025",
    titleKey: "ucla",
    location: "Los Angeles",
    university: "UCLA",
    date: "Oct 1",
    href: "https://lu.ma/f25ucla",
    image:
      "https://images.unsplash.com/photo-1626060490950-fabf0d72ca8a?q=80&w=2000",
  },
  {
    id: "usc-2025",
    titleKey: "usc",
    location: "Los Angeles",
    university: "USC",
    date: "Oct 3",
    href: "https://lu.ma/f25usc",
    image:
      "https://images.unsplash.com/photo-1612822798436-369a2448ad45?q=80&w=2000",
  },
  {
    id: "ut-austin-2025",
    titleKey: "utaustin",
    location: "Austin",
    university: "UT Austin",
    date: "Oct 15",
    href: "https://lu.ma/f25uta",
    image:
      "https://images.unsplash.com/photo-1595169359806-eee943bd8b97?q=80&w=2000",
  },
  {
    id: "mit-harvard-2025",
    titleKey: "workshop",
    location: "Cambridge",
    university: "MIT & Harvard University",
    date: "Oct 22",
    href: "https://lu.ma/f25mh",
    image:
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2000",
  },
  {
    id: "nu-bu-bc-2025",
    titleKey: "workshop",
    location: "Boston",
    university: "NU & BU & BC",
    date: "Oct 24",
    href: "https://lu.ma/f25nbb",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2000",
  },
  {
    id: "nyu-2025",
    titleKey: "nyu",
    location: "New York",
    university: "NYU",
    date: "Oct 27",
    href: "https://lu.ma/f25nyu",
    image:
      "https://images.unsplash.com/photo-1601071334789-37a6e666fa37?q=80&w=2000",
  },
  {
    id: "columbia-2025",
    titleKey: "columbia",
    location: "New York",
    university: "Columbia",
    date: "Oct 29",
    href: "https://lu.ma/f25cu",
    image:
      "https://images.unsplash.com/photo-1698248476242-bfde13928633?q=80&w=2000",
  },
  {
    id: "upenn-princeton-2025",
    titleKey: "workshop",
    location: "Philadelphia",
    university: "UPenn & Princeton University",
    date: "Oct 31",
    href: "https://lu.ma/f25up",
    image:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=2000",
  },
];

export default function UniversityEventsGrid() {
  const t = useTranslations();

  return (
    <section className="[padding-block:1rem] sm:[padding-block:3rem] px-4 relative overflow-hidden">
      <GradientOrbs
        orbs={[orbPresets.topRightGreen, orbPresets.bottomLeftPurple]}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12">
          {t("universities.events.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universityEvents.map((event) => (
            <UniversityEventCard
              key={event.id}
              id={event.id}
              title={t(`universities.events.${event.titleKey}.title`)}
              location={event.location}
              university={event.university}
              date={event.date}
              description={t(
                `universities.events.${event.titleKey}.description`,
              )}
              image={event.image}
              href={event.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
