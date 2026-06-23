import {
  CalendarDays,
  Coffee,
  DoorOpen,
  Laptop,
  Mic,
  MonitorPlay,
  Presentation,
  Sun,
} from "lucide-react";

export const LINKS = {
  fridayCoworking: "https://luma.com/solana-nyc",
  eventsCalendar: "https://luma.com/solana-nyc",
  membershipApplication:
    "https://32954solan.yardikube.com/kubecc/content/#/app/packagedetails?companyid=320&amenityid=38&proid=1&groupid=6",
  contactEmail: "mailto:skyline@solana.org",
};

export const META = {
  seoImage: "/src/img/skyline/solana-skyline-social.webp",
} as const;

/** Luma calendar api id for https://luma.com/solana-nyc (Skyline / Solana NYC) */
export const SKYLINE_CALENDAR_ID = "cal-xIDT6vXOhDyC4FM";

/** Membership tiers; copy lives under skyline.membership.tiers.<key> */
export const MEMBERSHIP_TIERS = [
  { key: "fridays", href: LINKS.fridayCoworking },
  { key: "partTime", href: LINKS.membershipApplication },
  { key: "fullTime", href: LINKS.membershipApplication },
];

export const QUICK_LINKS = [
  { key: "cowork", href: "#coworking", Icon: Laptop },
  { key: "visit", href: LINKS.contactEmail, Icon: DoorOpen },
  { key: "events", href: LINKS.eventsCalendar, Icon: CalendarDays },
  { key: "host", href: "#host-events", Icon: Presentation },
];

export type SkylineGalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  variant: "wide" | "tall" | "panorama";
};

export const SKYLINE_GALLERY_IMAGES: SkylineGalleryImage[] = [
  {
    src: "/src/img/skyline/what-is.webp",
    alt: "Builders working together at Skyline with Lower East Side views",
    width: 1600,
    height: 1067,
    variant: "wide",
  },
  {
    src: "/src/img/skyline/gallery/img_4925.webp",
    alt: "Skyline community kitchen and event setup",
    width: 1800,
    height: 1350,
    variant: "wide",
  },
  {
    src: "/src/img/skyline/coworking.webp",
    alt: "Skyline coworking desks with monitors and builders at work",
    width: 1000,
    height: 667,
    variant: "wide",
  },
  {
    src: "/src/img/skyline/gallery/img_4926.webp",
    alt: "Skyline lounge with couches, conference screen, and city views",
    width: 1350,
    height: 1800,
    variant: "tall",
  },
  {
    src: "/src/img/skyline/host-event.webp",
    alt: "Panel event hosted in the Skyline venue",
    width: 1000,
    height: 1356,
    variant: "tall",
  },
  {
    src: "/src/img/skyline/gallery/img_4927.webp",
    alt: "Solana Studios recording lounge with colorful seating and ring light",
    width: 1800,
    height: 1350,
    variant: "wide",
  },
  {
    src: "/src/img/skyline/gallery/img_4928.webp",
    alt: "Skyline workspace with a builder at a high table overlooking Manhattan",
    width: 1350,
    height: 1800,
    variant: "tall",
  },
  {
    src: "/src/img/skyline/hero-skyline.webp",
    alt: "Manhattan skyline view from Skyline",
    width: 2600,
    height: 947,
    variant: "panorama",
  },
];

export const SPACES = [
  { key: "coworking", Icon: Laptop },
  { key: "venue", Icon: MonitorPlay },
  { key: "studios", Icon: Mic },
  { key: "community", Icon: Coffee },
  { key: "conference", Icon: Presentation },
  { key: "roof", Icon: Sun },
];

export const AMENITY_COUNT = 7;
export const PERK_COUNT = 5;
export const VENUE_DETAIL_COUNT = 4;
export const VENUE_FEATURE_COUNT = 5;
export const FAQ_COUNT = 8;
