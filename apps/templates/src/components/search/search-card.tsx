"use client";

import React from "react";

import type { TemplateRecord } from "../../types";
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchCardProps {
  template: TemplateRecord;
  isActive?: boolean;
  onCardClick?: () => void;
  id?: string;
}

const TECH_LOGOS = {
  next: { src: "/next-logo.svg", alt: "Next.js logo" },
  vite: { src: "/vite.svg", alt: "Vite logo" },
  react: { src: "/react.svg", alt: "React logo" },
  expo: { src: "/expo.svg", alt: "Expo logo" },
  node: { src: "/nodejs.svg", alt: "Node.js logo" },
  other: { src: "/javascript.svg", alt: "JavaScript logo" },
} as const;

export const SearchCard = React.memo<SearchCardProps>(
  ({ template, isActive = false, onCardClick, id }) => {
    const { name, description, tech, displayName } = template;

    const randomRotation = useMemo(() => Math.floor(Math.random() * 360), []);

    const PlaceholderLogo = () => (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    );

    const renderLogo = () => {
      const logoConfig = TECH_LOGOS[tech];
      if (logoConfig) {
        return (
          <Image
            src={logoConfig.src}
            alt={logoConfig.alt}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        );
      }

      return <PlaceholderLogo />;
    };

    const templateUrl = `/${template.name}`;

    return (
      <Link
        href={templateUrl}
        role="option"
        aria-selected={isActive}
        onClick={onCardClick}
        id={id}
        className={`
        block p-4 rounded-xl metallic-border transition duration-200 ease-in-out
        ${
          isActive
            ? "bg-neutral-700 opacity-100 ring-2 ring-neutral-500"
            : "bg-neutral-900 opacity-55 hover:opacity-100 hover:bg-neutral-800"
        }
        focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900
      `}
        style={{ "--rotation": `${randomRotation}deg` } as React.CSSProperties}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-neutral-400 mt-0.5">
            {renderLogo()}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-neutral-100 font-medium text-sm truncate">
              {displayName || name}
            </h3>
            <p className="text-neutral-400 text-xs mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Link>
    );
  },
);

SearchCard.displayName = "SearchCard";
