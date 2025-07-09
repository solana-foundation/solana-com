"use client";

import React from "react";
import Link from "next/link";

interface ResourceLinkProps {
  href: string;
  label: string;
  description: string;
  ariaLabel: string;
}

export default function ResourceLink({
  href,
  label,
  description,
  ariaLabel,
}: ResourceLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-white hover:underline hover:decoration-current focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2 -my-1 transition-all duration-200 group"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        <span className="flex items-center gap-2">
          <span className="font-medium text-[#9945FF]">{label}</span>
          <span className="text-gray-400" aria-hidden="true">
            - {description}
          </span>
        </span>
        <svg
          className="w-4 h-4 text-gray-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </Link>
    </li>
  );
}
