import React from "react";
import Link from "next/link";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(classNames(inputs));
}

interface LearnCardProps {
  index: number;
  title: string;
  description: string;
  href: string;
  className?: string;
  partLabel?: string;
  readMoreLabel?: string;
  readMoreAriaLabel?: string;
}

export const LearnCard: React.FC<LearnCardProps> = ({
  index,
  title,
  description,
  href,
  className,
  partLabel = "Part",
  readMoreLabel = "Read more",
  readMoreAriaLabel = "Read more about",
}) => {
  return (
    <article
      className={cn(
        "group flex flex-col h-full",
        "bg-gray-900/95 backdrop-blur-sm",
        "rounded-2xl",
        "shadow-lg hover:shadow-2xl hover:bg-gray-900",
        "transition-all duration-200",
        "overflow-hidden",
        className,
      )}
      role="listitem"
    >
      <div className="flex flex-col h-full p-6 ">
        {/* Content */}
        <div>
          <h3 className="mb-3">
            <Link
              href={href}
              className="text-lg font-semibold text-white hover:text-[#9945FF] hover:underline transition-colors duration-200 line-clamp-2 focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
              aria-label={`${partLabel} ${index}: ${title}`}
            >
              <span aria-hidden="true">
                {partLabel} {index}:{" "}
              </span>
              <span>{title}</span>
            </Link>
          </h3>
          <p className="text-sm text-gray-200 line-clamp-4">{description}</p>
        </div>

        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-[#9945FF] hover:underline transition-colors duration-200 mt-4 focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
          aria-label={`${readMoreAriaLabel} ${title}`}
        >
          <span>{readMoreLabel}</span>
          <svg
            className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default LearnCard;
