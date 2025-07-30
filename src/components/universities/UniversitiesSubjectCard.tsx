"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ParticleEffect from "./ParticleEffect";

interface UniversitiesSubjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradientFrom?: string;
  gradientTo?: string;
}

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export default function UniversitiesSubjectCard({
  title,
  description,
  icon,
  href,
  gradientFrom = "#9333ea",
  gradientTo = "#2563eb",
}: UniversitiesSubjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");
  const [cardDimensions, setCardDimensions] = useState({
    width: 300,
    height: 400,
  });
  const cardRef = useRef<HTMLDivElement>(null);

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const solanaGradient = `radial-gradient(75% 181.16% at 50% 50%, #14F195 0%, #9945FF 50%, rgba(255, 255, 255, 0) 100%)`;

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <div className="d-block" style={{ minWidth: "300px", maxWidth: "300px" }}>
      <Link href={href} className="text-decoration-none">
        <div
          className="position-relative"
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
          {/* Animated gradient border - only show on hover */}
          {hovered && (
            <div
              className="position-absolute"
              style={{
                inset: 0,
                borderRadius: "inherit",
                background: solanaGradient,
                filter: "blur(2px)",
                animation: "fadeIn 0.3s ease",
                zIndex: -1,
              }}
            />
          )}

          {/* Card content */}
          <div
            className="position-relative overflow-hidden"
            style={{
              height: "400px",
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "15px",
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            {/* Particle effect - always rendered for performance */}
            <ParticleEffect
              isHovered={hovered}
              width={cardDimensions.width}
              height={cardDimensions.height}
            />

            {/* Content */}
            <div
              className="position-relative h-100 d-flex flex-column align-items-center justify-content-center p-4"
              style={{ zIndex: 1 }}
            >
              {/* Icon */}
              <div className="mb-4 text-white">{icon}</div>

              {/* Title */}
              <h3
                className="text-white text-center"
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h3>
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
