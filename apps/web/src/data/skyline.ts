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
