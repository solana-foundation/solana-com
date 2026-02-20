"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import ParticleEffect from "./ParticleEffect";

interface UniversitiesSubjectCardProps {
  title: string;
  description: string;
  learnMore: string;
  icon: React.ReactNode;
  href: string;
}

export default function UniversitiesSubjectCard({
  title,
  description,
  learnMore,
  icon,
  href,
}: UniversitiesSubjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [cardDimensions, setCardDimensions] = useState({
    width: 300,
    height: 400,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="block" style={{ minWidth: "300px", maxWidth: "300px" }}>
      <Link
        href={href}
        className="no-underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className="relative"
          style={{ borderRadius: "16px", padding: "1px" }}
          ref={cardRef}
          onMouseEnter={() => {
            setHovered(true);
            if (cardRef.current) {
              const rect = cardRef.current.getBoundingClientRect();
              setCardDimensions({ width: rect.width, height: rect.height });
            }
          }}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && (
            <div className="absolute inset-0 rounded-[inherit] universities-card-hover-gradient blur-[2px] -z-[1]" />
          )}

          {/* Card content */}
          <div className="relative overflow-hidden cursor-pointer rounded-[15px] h-[400px] bg-[#0a0a0a] border-white-10 z-[1]">
            <ParticleEffect
              isHovered={hovered}
              width={cardDimensions.width}
              height={cardDimensions.height}
            />

            <div className="relative h-full flex flex-col items-center justify-center p-4 z-[1]">
              <div
                className="mb-4 text-white transition-transform duration-300 ease-in-out"
                style={{
                  transform: hovered ? "translateY(-10px)" : "translateY(0)",
                }}
              >
                {icon}
              </div>

              <h3 className="text-white text-center text-2xl font-semibold tracking-tight relative inline-block">
                {title}
                <span
                  className={`absolute left-0 bottom-[-4px] h-[2px] bg-[#9945FF] transition-all duration-300 ease-out ${hovered ? "w-full" : "w-0"}`}
                ></span>
              </h3>

              <div
                className={`text-center mt-3 transition-all duration-500 ease-in-out ${hovered ? "opacity-100 max-h-20" : "opacity-0 max-h-0"} overflow-hidden`}
              >
                <p className="text-gray-300 text-sm mb-3 transition-opacity duration-700 delay-100">
                  {description}
                </p>
                <span className="text-white text-sm font-medium transition-opacity duration-700 delay-200">
                  {learnMore}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
