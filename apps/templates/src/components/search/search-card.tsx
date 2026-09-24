"use client";

import React from "react";

import type { TemplateRecord } from "../../types";
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
        block p-4 rounded-xl border transition duration-200 ease-in-out
        ${
          isActive
            ? "bg-nd-border-prominent opacity-100 ring-1 ring-nd-border-hovered border-nd-border-hovered"
            : "bg-white/[0.03] border-nd-border-light opacity-70 hover:opacity-100 hover:bg-white/[0.06] hover:border-nd-border-prominent"
        }
        focus:outline-none focus:ring-2 focus:ring-nd-highlight-lavendar/40
      `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-nd-mid-em-text mt-0.5">
            {renderLogo()}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-nd-high-em-text font-medium text-sm truncate">
              {displayName || name}
            </h3>
            <p className="text-nd-mid-em-text text-xs mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Link>
    );
  },
);

SearchCard.displayName = "SearchCard";
