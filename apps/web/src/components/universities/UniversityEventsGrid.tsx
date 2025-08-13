"use client";

import React from "react";
import UniversityEventCard from "./UniversityEventCard";
import { useTranslations } from "next-intl";
import GradientOrbs, { orbPresets } from "./GradientOrbs";

// Still confirming some of these with partners and waiting on Luma links
const universityEvents = [
  {
    id: "stanford-2025",
    titleKey: "stanford",
    location: "Stanford",
    university: "Stanford University",
    date: "Sept 4",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1681782421891-5088f13466ec?q=80&w=2000",
  },
  {
    id: "berkeley-2025",
    titleKey: "berkeley",
    location: "Berkeley",
    university: "UC Berkeley",
    date: "Sept 10",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1694391505705-7fde96f6f14f?q=80&w=2000",
  },
  {
    id: "purdue-2025",
    titleKey: "purdue",
    location: "West Lafayette",
    university: "Purdue University",
    date: "Sept 12-14",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1598058921517-81a452bc7cce?q=80&w=2000",
  },
  {
    id: "ucla-2025",
    titleKey: "ucla",
    location: "Los Angeles",
    university: "UCLA",
    date: "Sept 16",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1626060490950-fabf0d72ca8a?q=80&w=2000",
  },
  {
    id: "usc-2025",
    titleKey: "usc",
    location: "Los Angeles",
    university: "USC",
    date: "Sept 18",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1612822798436-369a2448ad45?q=80&w=2000",
  },
  // Hack the Nest - Sept 20 - Confirming details
  // {
  //   id: "hack-the-nest-2025",
  //   titleKey: "hackathon",
  //   location: "TBD",
  //   university: "Hack the Nest",
  //   date: "Sept 20",
  //   href: "#",
  //   image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000",
  // },
  {
    id: "ut-austin-2025",
    titleKey: "utaustin",
    location: "Austin",
    university: "UT Austin",
    date: "Sept 25",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1595169359806-eee943bd8b97?q=80&w=2000",
  },
  // MIT & Harvard - Oct 8 - Confirming schedule
  // {
  //   id: "mit-harvard-2025",
  //   titleKey: "workshop",
  //   location: "Cambridge",
  //   university: "MIT & Harvard",
  //   date: "Oct 8",
  //   href: "#",
  //   image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=2000",
  // },
  // NU & BU & BC - Oct 10 - Confirming schedule
  // {
  //   id: "nu-bu-bc-2025",
  //   titleKey: "workshop",
  //   location: "Boston",
  //   university: "NU & BU & BC",
  //   date: "Oct 10",
  //   href: "#",
  //   image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2000",
  // },
  {
    id: "columbia-2025",
    titleKey: "columbia",
    location: "New York",
    university: "Columbia",
    date: "Oct 14",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1698248476242-bfde13928633?q=80&w=2000",
  },
  {
    id: "nyu-2025",
    titleKey: "nyu",
    location: "New York",
    university: "NYU",
    date: "Oct 16",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1601071334789-37a6e666fa37?q=80&w=2000",
  },
  // UPenn & Princeton - Oct 22 - Confirming schedule
  // {
  //   id: "upenn-princeton-2025",
  //   titleKey: "workshop",
  //   location: "Philadelphia",
  //   university: "UPenn & Princeton",
  //   date: "Oct 22",
  //   href: "#",
  //   image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=2000",
  // },
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
