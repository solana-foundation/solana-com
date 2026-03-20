"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const TYPE_SPEED = 48;
const DELETE_SPEED = 20;
const PAUSE_AFTER_TYPE = 3000;
const PAUSE_AFTER_DELETE = 500;

function useTypingAnimation(texts: string[], isEnabled: boolean) {
  const [displayText, setDisplayText] = useState("");
  const state = useRef({ promptIndex: 0, isDeleting: false, charCount: 0 });

  useEffect(() => {
    if (!isEnabled) return;

    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const s = state.current;
      const current = texts[s.promptIndex];

      if (s.isDeleting) {
        s.charCount -= 1;
        setDisplayText(current.slice(0, s.charCount));
        if (s.charCount === 0) {
          s.isDeleting = false;
          s.promptIndex = (s.promptIndex + 1) % texts.length;
          timeout = setTimeout(tick, PAUSE_AFTER_DELETE);
        } else {
          timeout = setTimeout(tick, DELETE_SPEED);
        }
      } else {
        s.charCount += 1;
        setDisplayText(current.slice(0, s.charCount));
        if (s.charCount === current.length) {
          s.isDeleting = true;
          timeout = setTimeout(tick, PAUSE_AFTER_TYPE);
        } else {
          timeout = setTimeout(tick, TYPE_SPEED);
        }
      }
    }

    timeout = setTimeout(tick, PAUSE_AFTER_DELETE);
    return () => clearTimeout(timeout);
  }, [texts, isEnabled]);

  return isEnabled ? displayText : null;
}

const visualSrc1 = "/src/img/solutions/sdp/ai-advantages-visual-1.svg";
const visualBgSrc1 = "/src/img/solutions/sdp/ai-advantages-visual-bg-1.jpg";
const visualSrc2 = "/src/img/solutions/sdp/ai-advantages-visual-2.svg";
const visualBgSrc2 = "/src/img/solutions/sdp/ai-advantages-visual-bg-2.jpg";

const Checkmark = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M2.5 8.5L6 12L13.5 4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface AiAdvantagesProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: string[];
  prompts?: string[];
}

export const AiAdvantages = (props: AiAdvantagesProps): React.ReactElement => {
  const { title, description, items, prompts = [] } = props;
  const [show, setShow] = useState<1 | 2>(1);
  const { ref, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  const typingText = useTypingAnimation(prompts, isIntersecting);

  return (
    <section
      className="flex flex-col items-center w-full bg-[#0C0C0E]"
      ref={ref}
    >
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        <div className="flex flex-col xl:flex-row">
          {/* Left column: heading + checklist */}
          <div className="flex-1 flex flex-col xl:border-r xl:border-white/[0.08]">
            {/* Heading */}
            <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20 grow">
              <div className="flex flex-col gap-5 xl:gap-6">
                <h2 className="nd-heading-l-a text-white xl:max-w-[514px]">
                  {title}
                </h2>
                {description && (
                  <p className="nd-body-l max-w-[558px] text-white/[0.64]">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Checklist */}
            {items && (
              <div className="px-3 xl:px-0 border-t border-b xl:border-b-0 border-white/[0.08] grow-0">
                {items.map((item, i) => {
                  const isLast = i === items.length - 1;
                  return (
                    <div
                      key={item}
                      className={[
                        "flex items-center",
                        "h-10 md:h-16 xl:h-20",
                        "border-x xl:border-x-0 border-white/[0.08]",
                        !isLast
                          ? "border-b"
                          : "border-b border-b-transparent mb-[-1px]",
                      ].join(" ")}
                    >
                      {/* Checkmark box */}
                      <div className="shrink-0 grow-0 aspect-square xl:w-[11%] h-full flex items-center justify-center border-r border-white/[0.08]">
                        <Checkmark className="w-3 h-3 xl:w-4 xl:h-4" />
                      </div>
                      {/* Label */}
                      <span className="nd-body-l text-white px-5">{item}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column: visual */}
          <div className="relative flex-1 xl:min-h-[702px] overflow-hidden aspect-[40/39]">
            <img
              src={show === 2 ? visualBgSrc2 : visualBgSrc1}
              alt=""
              aria-hidden
              className="absolute w-full h-full object-cover pointer-events-none"
            />
            <div className="relative">
              <Image
                className="w-full"
                src={show === 2 ? visualSrc2 : visualSrc1}
                alt=""
                width={720}
                height={702}
              />
              <button
                className="absolute top-[22.9%] left-[7.5%] w-[21.8%] h-[46px] bg-transparent"
                aria-label="Claude Code"
                onClick={() => setShow(1)}
              ></button>
              <button
                className="absolute top-[22.9%] left-[29.3%] w-[18%] h-[46px] bg-transparent"
                aria-label="Codex"
                onClick={() => setShow(2)}
              ></button>
              {typingText && (
                <div className="absolute top-[65.5%] left-[10.8%] right-[12%] nd-body-m bg-[#131316] px-3 !-mx-3">
                  <svg viewBox="0 0 500 80" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject x="0" y="0" width="500" height="80">
                      <span className="nd-body-s" id="typing-text-animation">
                        {typingText}
                        <span
                          className="w-[2px] h-[1em] inline-block -mb-1 ml-1"
                          style={{
                            backgroundColor: show === 2 ? "#94A1FE" : "#E8704E",
                          }}
                        ></span>
                      </span>
                    </foreignObject>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
