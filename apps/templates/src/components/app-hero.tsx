import React from "react";
import { BackgroundShapes } from "./background-shapes";

export function AppHero({
  children,
  subtitle,
  title,
}: {
  children?: React.ReactNode;
  subtitle?: React.ReactNode;
  title?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-16">
      <BackgroundShapes />
      <div className="text-center z-10">
        <div className="max-w-2xl">
          {typeof title === "string" ? (
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="pt-2 md:pt-3 md:max-w-2xl mx-auto text-sm md:text-base text-neutral-400">
              {subtitle}
            </p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
