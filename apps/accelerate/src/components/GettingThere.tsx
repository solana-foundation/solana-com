"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, stagger } from "@/lib/animations";

interface InfoRowProps {
  label: string;
  value: string;
  subValue?: string;
  link?: {
    text: string;
    href: string;
  };
}

function InfoRow({ label, value, subValue, link }: InfoRowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 gap-4 border-b border-white/10 py-6 last:border-b-0 lg:grid-cols-[360px_1fr]"
    >
      <p className="gradient-text text-h2">{label}</p>
      <div>
        <p className="text-h2 text-white">{value}</p>
        {subValue && (
          <p className="text-p mt-3 text-accelerate-green">
            {subValue}
            {link && (
              <>
                {" "}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accelerate-green underline hover:no-underline"
                >
                  {link.text}
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Nomadz booking query params for Accelerate dates ─── */
const NOMADZ_PARAMS =
  "?checkin=2026-05-04&checkout=2026-05-07&guests.rooms%5B0%5D.adults=1&guests.rooms[0].children[]";

const NOMADZ_MORE_STAYS =
  "https://nomadz.xyz/stays?locationInputValue=Miami%2C%20FL%2C%20USA&destination.location=Miami&destination.latitude=25.7949095&destination.longitude=-80.1358448&filters.stars%5B0%5D=2&filters.stars%5B1%5D=3&filters.stars%5B2%5D=4&filters.stars%5B3%5D=5&filters.hideSoldOut=true&filters.distanceToPointMax=5000&checkIn=2026-05-04T00%3A00%3A00.000Z&checkOut=2026-05-07T00%3A00%3A00.000Z&guests.rooms%5B0%5D.adults=1&guests.rooms[0].children[]&sort.property=Discount&sort.direction=desc";

/* ─── Hotel deal data from Nomadz partnership ─── */
const HOTEL_DEALS = [
  {
    name: "Hotel Indigo Miami Brickell",
    subtitle: "by IHG",
    discount: 39,
    accent: "#19FB9B",
    accentRgb: "25, 251, 155",
    propertyId: "40739216",
  },
  {
    name: "Miami Marriott Biscayne Bay",
    subtitle: "",
    discount: 33,
    accent: "#9945FF",
    accentRgb: "153, 69, 255",
    propertyId: "1345",
  },
  {
    name: "Homewood Suites by Hilton",
    subtitle: "Miami Downtown / Brickell",
    discount: 33,
    accent: "#2A88DE",
    accentRgb: "42, 136, 222",
    propertyId: "10974648",
  },
  {
    name: "EAST Miami Residences",
    subtitle: "",
    discount: 31,
    accent: "#00D4FF",
    accentRgb: "0, 212, 255",
    propertyId: "78570563",
  },
  {
    name: "Hilton Miami Downtown",
    subtitle: "",
    discount: 31,
    accent: "#9945FF",
    accentRgb: "153, 69, 255",
    propertyId: "2228",
  },
  {
    name: "Sentral Alea Miami",
    subtitle: "",
    discount: 29,
    accent: "#2A88DE",
    accentRgb: "42, 136, 222",
    propertyId: "101620100",
  },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

function DiscountBadge({ discount }: { discount: number }) {
  // Higher discounts get green, lower get purple/blue tones
  const isHighDiscount = discount >= 30;
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        isHighDiscount
          ? "bg-[#19FB9B]/15 text-[#19FB9B]"
          : "bg-white/10 text-white/70"
      }`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className={isHighDiscount ? "text-[#19FB9B]" : "text-white/50"}
      >
        <path
          d="M5 0L6.12 3.88L10 5L6.12 6.12L5 10L3.88 6.12L0 5L3.88 3.88L5 0Z"
          fill="currentColor"
        />
      </svg>
      {discount}% off
    </div>
  );
}

function HotelCard({
  hotel,
  index,
}: {
  hotel: (typeof HOTEL_DEALS)[number];
  index: number;
}) {
  const bookingUrl = `https://nomadz.xyz/property/${hotel.propertyId}${NOMADZ_PARAMS}`;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-white/[0.08]"
      style={
        {
          "--card-accent": hotel.accent,
          "--card-accent-rgb": hotel.accentRgb,
          background: `
            radial-gradient(ellipse at 20% 0%, rgba(${hotel.accentRgb}, 0.05) 0%, transparent 60%),
            rgba(255, 255, 255, 0.02)
          `,
        } as React.CSSProperties
      }
    >
      {/* Top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-50 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to right, ${hotel.accent}, transparent 80%)`,
        }}
      />

      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, rgba(${hotel.accentRgb}, 0.07) 0%, transparent 70%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-1 flex-col p-6 lg:p-7">
        {/* Header: badge + hotel name */}
        <div className="mb-6">
          <DiscountBadge discount={hotel.discount} />
          <h3 className="mt-3 text-lg font-medium leading-tight text-white lg:text-xl">
            {hotel.name}
          </h3>
          {hotel.subtitle && (
            <p className="mt-1 text-sm text-white/40">{hotel.subtitle}</p>
          )}
        </div>

        {/* Location */}
        <p className="mb-6 mt-auto font-diatype text-sm text-white/40">
          Miami, US
        </p>

        {/* CTA */}
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-gradient group/btn flex h-[44px] items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.05em]"
        >
          Book now
          <svg
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

interface GettingThereProps {
  translationPrefix?: string;
  showHotelDeals?: boolean;
  hotelDealsLink?: {
    text: string;
    href: string;
  };
}

export function GettingThere({
  translationPrefix = "accelerate.gettingThere",
  showHotelDeals = false,
  hotelDealsLink,
}: GettingThereProps = {}) {
  const t = useTranslations(translationPrefix);

  return (
    <section id="getting-there" className="section-accelerate">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.h2 variants={fadeInUp} className="section-heading">
            {t("heading")}
          </motion.h2>

          {/* Divider line */}
          <div className="section-divider" />

          {/* Airport info */}
          <div className="mx-auto max-w-4xl">
            <InfoRow
              label={t("nearestAirportLabel")}
              value={t("nearestAirportValue")}
            />
          </div>

          {/* Accommodations link (simple single-link variant) */}
          {hotelDealsLink && !showHotelDeals && (
            <div className="mx-auto max-w-4xl">
              <InfoRow
                label={t("accommodationsLabel")}
                value={t("accommodationsValue")}
                subValue={t("accommodationsSubValue")}
                link={hotelDealsLink}
              />
            </div>
          )}

          {/* Accommodations section (Nomadz hotel deals card grid) */}
          {showHotelDeals && (
            <motion.div variants={fadeInUp} className="mt-12 lg:mt-16">
              {/* Accommodations header */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="gradient-text text-h2">
                    {t("accommodationsLabel")}
                  </p>
                  <p className="text-p mt-2 !text-base text-white/50">
                    Curated deals near the venue &middot; May 4&ndash;7
                  </p>
                </div>
                <a
                  href="https://nomadz.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/nomadz flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
                >
                  Powered by
                  <span className="font-semibold tracking-wide text-white/60 transition-colors group-hover/nomadz:text-white">
                    NOMADZ
                  </span>
                  <svg
                    className="h-3 w-3 opacity-40 transition-all duration-300 group-hover/nomadz:translate-x-0.5 group-hover/nomadz:opacity-70"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Hotel cards grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {HOTEL_DEALS.map((hotel, i) => (
                  <HotelCard key={hotel.name} hotel={hotel} index={i} />
                ))}
              </div>

              {/* More stays link */}
              <div className="mt-6 flex justify-center">
                <a
                  href={NOMADZ_MORE_STAYS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gradient group/btn flex h-[48px] items-center gap-2 px-8 text-sm font-semibold uppercase tracking-[0.05em]"
                >
                  More stays
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
