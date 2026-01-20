"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Ticket } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface EventDetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

function EventDetailItem({
  icon,
  label,
  value,
  subValue,
}: EventDetailItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex items-start gap-4 border-b border-white/10 py-6 last:border-b-0"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-accelerate-purple">
        {icon}
      </div>
      <div className="flex-1">
        <p className="mb-1 text-sm text-white/50">{label}</p>
        <p className="text-lg font-medium text-white">{value}</p>
        {subValue && <p className="mt-1 text-sm text-white/60">{subValue}</p>}
      </div>
    </motion.div>
  );
}

export function EventDetails() {
  return (
    <section id="event-details" className="section bg-accelerate-dark">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="heading-lg mb-12 text-white"
          >
            Event details
          </motion.h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Details list */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <EventDetailItem
                icon={<Calendar className="h-5 w-5" />}
                label="Date"
                value="February 19, 2025"
              />
              <EventDetailItem
                icon={<MapPin className="h-5 w-5" />}
                label="Venue"
                value="Hong Kong Convention and Exhibition Centre"
                subValue="1 Harbour Road, Wan Chai, Hong Kong"
              />
              <EventDetailItem
                icon={<Clock className="h-5 w-5" />}
                label="Time"
                value="9:00 AM (GMT+8)"
              />
              <EventDetailItem
                icon={<Ticket className="h-5 w-5" />}
                label="Tickets"
                value="Wait for April 2025"
              />
            </div>

            {/* Map placeholder */}
            <motion.div
              variants={fadeInUp}
              className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:aspect-auto lg:min-h-[400px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-8 w-8 text-accelerate-purple" />
                  </div>
                  <p className="text-lg font-medium text-white">EMBEDDED MAP</p>
                  <p className="mt-2 text-sm text-white/50">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
              {/* Map background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239945FF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
