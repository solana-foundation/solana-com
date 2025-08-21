"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface UniversityEventCardProps {
  id: string;
  title: string;
  location: string;
  university: string;
  date: string;
  description: string;
  image: string;
  href: string;
}

export default function UniversityEventCard({
  title,
  location,
  university,
  date,
  description,
  image,
  href,
}: UniversityEventCardProps) {
  return (
    <Link
      href={href}
      className="block group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={`${title} at ${university}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h3 className="text-white text-3xl font-bold">{location}</h3>
          </div>
        </div>

        <div className="p-4 space-y-2 bg-transparent">
          <h4 className="text-white font-semibold text-lg">{university}</h4>
          <p className="text-[#14f195] text-sm font-medium">{date}</p>
          <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
}
