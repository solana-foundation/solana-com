"use client";

import React, { useState } from "react";
import { VideoTrigger } from "@/component-library/video-modal";

export interface TutorialItem {
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  platform: "youtube" | "vimeo";
}

export interface TutorialsProps {
  title?: string;
  items?: TutorialItem[];
}

const bgSrc = "/src/img/solutions/sdp/tutorials-bg.png";

export const Tutorials = ({
  title,
  items = [],
}: TutorialsProps): React.ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <section className="flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        {/* Header */}
        <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20">
          <h2 className="nd-heading-l-a text-white">{title}</h2>
        </div>

        {/* Content: video + playlist */}
        <div className="border-t border-white/[0.08] flex flex-col xl:flex-row overflow-hidden">
          {/* Video */}
          {active && (
            <div className="xl:w-1/2 border-b xl:border-b-0 xl:border-r border-white/[0.08] relative overflow-hidden shrink-0">
              <div className="relative aspect-video">
                <img
                  src={active.thumbnail}
                  alt={active.title}
                  className="absolute inset-0 w-full h-full max-w-none object-cover"
                />
                <div className="absolute inset-0 bg-black/[0.32]" />
                <VideoTrigger
                  platform={active.platform}
                  id={active.videoId}
                  title={active.title}
                  bgColorClass="!bg-black/70"
                  className="!w-14 !h-14 !bg-white/[0.08] hover:!bg-white/[0.12] border border-white/[0.20] hover:border-white/[0.28] backdrop-blur-[6px] group"
                  iconClassName="!w-4 !h-4 opacity-[0.64] group-hover:opacity-[1]"
                />
              </div>
            </div>
          )}

          {/* Playlist */}
          <div
            className="xl:w-1/2 flex flex-col xl:pb-4 max-xl:!bg-none !grow-0"
            style={{
              backgroundImage: `url(${bgSrc})`,
              backgroundPositionX: "4px",
            }}
          >
            <div
              className="h-[17px] w-full xl:hidden"
              style={{
                backgroundImage: `url(${bgSrc})`,
              }}
            ></div>
            <div className="px-3 xl:px-0 border-t border-b xl:border-b-0 xl:border-t-0 border-white/[0.08] bg-[#0C0C0E]">
              {items.map((tutorial, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={[
                      "flex items-center w-full text-left cursor-pointer",
                      "border-b border-white/[0.08] border-x xl:border-x-0 max-xl:last:border-b-0",
                      "h-10 md:h-16 xl:h-20",
                      "transition-colors hover:!bg-[#161618]",
                    ].join(" ")}
                  >
                    {/* Dot + title area */}
                    <div className="flex items-center gap-2 xl:gap-5 flex-1 min-w-0 pl-5 xl:pl-[26px] pr-5 xl:pr-0">
                      {/* Active indicator dot — desktop only */}
                      {isActive && (
                        <span
                          aria-hidden
                          className="block shrink-0 w-[10px] h-[10px] rounded-full bg-white"
                        />
                      )}
                      <span
                        className={[
                          "nd-body-l truncate",
                          isActive
                            ? "text-white font-medium"
                            : "text-white/[0.64]",
                        ].join(" ")}
                      >
                        {tutorial.title}
                      </span>
                    </div>

                    {/* Duration — desktop only */}
                    <span className="hidden xl:flex items-center justify-center shrink-0 w-20 h-20 border-l border-white/[0.08] nd-body-s text-white/[0.64]">
                      {tutorial.duration}
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              className="h-[17px] w-full xl:hidden"
              style={{ backgroundImage: `url(${bgSrc})` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
