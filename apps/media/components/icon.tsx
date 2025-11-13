"use client";
//TODO: Fix Types in this file

import * as BoxIcons from "react-icons/bi";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import React from "react";
import { useLayout } from "./layout/layout-context";

export const IconOptions = {
  Tina: (props: any) => (
    <svg
      {...props}
      viewBox="0 0 66 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Tina</title>
      <path
        d="M39.4615 36.1782C42.763 33.4475 44.2259 17.3098 45.6551 11.5091C47.0843 5.70828 52.995 6.0025 52.995 6.0025C52.995 6.0025 51.4605 8.67299 52.0864 10.6658C52.7123 12.6587 57 14.4401 57 14.4401L56.0752 16.8781C56.0752 16.8781 54.1441 16.631 52.995 18.9297C51.8459 21.2283 53.7336 43.9882 53.7336 43.9882C53.7336 43.9882 46.8271 57.6106 46.8271 63.3621C46.8271 69.1136 49.5495 73.9338 49.5495 73.9338H45.7293C45.7293 73.9338 40.1252 67.2648 38.9759 63.9318C37.8266 60.5988 38.2861 57.2658 38.2861 57.2658C38.2861 57.2658 32.1946 56.921 26.7931 57.2658C21.3915 57.6106 17.7892 62.2539 17.1391 64.8512C16.4889 67.4486 16.2196 73.9338 16.2196 73.9338H13.1991C11.3606 68.2603 9.90043 66.2269 10.6925 63.3621C12.8866 55.4269 12.4557 50.9263 11.9476 48.9217C11.4396 46.9172 8 45.1676 8 45.1676C9.68492 41.7349 11.4048 40.0854 18.8029 39.9133C26.201 39.7413 36.1599 38.9088 39.4615 36.1782Z"
        fill="currentColor"
      />
      <path
        d="M20.25 63.03C20.25 63.03 21.0305 70.2533 25.1773 73.9342H28.7309C25.1773 69.9085 24.7897 59.415 24.7897 59.415C22.9822 60.0035 20.4799 62.1106 20.25 63.03Z"
        fill="currentColor"
      />
    </svg>
  ),
  ...BoxIcons,
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  AiFillInstagram,
};

const iconColorClass: {
  [name: string]: { regular: string; circle: string };
} = {
  blue: {
    regular: "text-blue-400",
    circle: "bg-blue-400 dark:bg-blue-500 text-blue-50",
  },
  teal: {
    regular: "text-teal-400",
    circle: "bg-teal-400 dark:bg-teal-500 text-teal-50",
  },
  green: {
    regular: "text-green-400",
    circle: "bg-green-400 dark:bg-green-500 text-green-50",
  },
  red: {
    regular: "text-red-400",
    circle: "bg-red-400 dark:bg-red-500 text-red-50",
  },
  pink: {
    regular: "text-pink-400",
    circle: "bg-pink-400 dark:bg-pink-500 text-pink-50",
  },
  purple: {
    regular: "text-purple-400",
    circle: "bg-purple-400 dark:bg-purple-500 text-purple-50",
  },
  orange: {
    regular: "text-orange-400",
    circle: "bg-orange-400 dark:bg-orange-500 text-orange-50",
  },
  yellow: {
    regular: "text-yellow-400",
    circle: "bg-yellow-400 dark:bg-yellow-500 text-yellow-50",
  },
  white: {
    regular: "text-white opacity-80",
    circle: "bg-white-400 dark:bg-white-500 text-white-50",
  },
};

const iconSizeClass = {
  xs: "w-6 h-6 shrink-0",
  small: "w-8 h-8 shrink-0",
  medium: "w-12 h-12 shrink-0",
  large: "w-14 h-14 shrink-0",
  xl: "w-16 h-16 shrink-0",
  custom: "",
} as const;

interface IconProps {
  data: {
    name: keyof typeof IconOptions;
    color?: string;
    size?: keyof typeof iconSizeClass | number;
    style?: string;
  };
  parentColor?: string;
  className?: string;
  tinaField?: string;
}

//@ts-ignore
export const Icon = ({
  data,
  parentColor = "",
  className = "",
  tinaField = "",
}: IconProps) => {
  const { theme } = useLayout();

  //@ts-ignore
  if (IconOptions[data.name] === null || IconOptions[data.name] === undefined) {
    return null;
  }

  const { name, color, size = "medium", style = "regular" } = data;

  //@ts-ignore
  const IconSVG = IconOptions[name];

  //@ts-ignore
  const iconSizeClasses =
    typeof size === "string"
      ? iconSizeClass[size as keyof typeof iconSizeClass]
      : iconSizeClass[
          Object.keys(iconSizeClass)[size] as keyof typeof iconSizeClass
        ];

  const iconColor =
    (color ? (color === "primary" ? theme?.color : color) : theme?.color) ||
    "blue"; // Add fallback to "blue"

  if (style == "circle") {
    return (
      <div
        {...(tinaField ? { "data-tina-field": tinaField } : {})} // only render data-tina-field if it exists
        className={`relative z-10 inline-flex items-center justify-center shrink-0 ${iconSizeClasses} rounded-full ${iconColorClass[iconColor].circle} ${className}`}
      >
        <IconSVG className="w-2/3 h-2/3" />
      </div>
    );
  } else {
    const iconColorClasses =
      iconColorClass[
        parentColor === "primary" &&
        (iconColor === theme!.color || iconColor === "primary")
          ? "white"
          : iconColor!
      ].regular;
    return (
      <IconSVG
        {...(tinaField ? { "data-tina-field": tinaField } : {})} // only render data-tina-field if it exists
        className={`${iconSizeClasses} ${iconColorClasses} ${className}`}
      />
    );
  }
};
