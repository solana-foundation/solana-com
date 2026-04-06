"use client";

import { ChevronRight } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/app/components/utils";

export type ResourceItem = {
  title: string;
  description?: string;
  href: string;
};

type ResourceListProps = {
  title?: string;
  description?: string;
  items: ResourceItem[];
  className?: string;
};

export const ResourceList = ({
  title,
  description,
  items,
  className,
}: ResourceListProps) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLUListElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      className={cn("relative text-white text-left overflow-hidden", className)}
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        {(title || description) && (
          <div className="mb-[32px] xl:mb-[48px] xl:w-2/5">
            {title && (
              <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[#ABABBA] text-lg md:text-2xl max-xl:mt-2 xl:mt-5 mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                {description}
              </p>
            )}
          </div>
        )}
        <ul
          ref={ref}
          className="p-0 m-0 list-none divide-y-[1px] divide-white/10 grid grid-cols-1 xl:grid-cols-2 max-md:gap-x-8 md:gap-x-16"
        >
          {items.map(
            ({ title: itemTitle, description: itemDesc, href }, index) => (
              <li
                key={href}
                className={cn("p-0", {
                  "xl:!border-t-0": index === 1,
                  "animate-fade-in-up": isIntersecting,
                })}
                style={
                  isIntersecting
                    ? { animationDelay: `${0.1 + index * 0.1}s` }
                    : { opacity: 0 }
                }
              >
                <a
                  href={href}
                  className="group flex flex-row w-full p-[24px_0] xl:p-[24px_12px] text-inherit focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl no-underline"
                >
                  <div className="mr-4 leading-4 md:leading-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d="M8 0V8H16V16H8V8H0V0H8Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="grow">
                    <p className="font-medium mb-0 text-base md:text-2xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.5] md:leading-[1.33]">
                      {itemTitle}
                    </p>
                    {itemDesc && (
                      <p className="text-[#ABABBA] mt-[2px] mb-0 text-base md:text-lg xl:text-xl tracking-[-0.16px] md:tracking-[-0.18px] xl:tracking-[-0.2px] leading-[1.5] md:leading-[1.77] xl:leading-[1.6]">
                        {itemDesc}
                      </p>
                    )}
                  </div>
                  <div className="leading-4 md:leading-6">
                    <ChevronRight
                      className="text-[#ABABBA] group-hover:text-white"
                      size={22}
                      aria-hidden={true}
                    />
                  </div>
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
};
