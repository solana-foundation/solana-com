import React from "react";
import { Container } from "@/component-library/container";
import {
  CompanyStatsCard,
  CompanyStatsCardProps,
} from "@/component-library/company-stats-card";
import { cn } from "@/app/components/utils";
import Image from "next/image";
import { Logo, Logos } from "@/component-library/logos";
import { Button } from "@/app/components/ui/button";

export type ProjectsProps = {
  className?: string;
  title?: React.ReactNode;
  projects?: (CompanyStatsCardProps & { colSpan?: number })[];
  bgSrc?: string;
  logos?: Logo[];
  cta?: string;
  ctaHref?: string;
};

export const Projects: React.FC<ProjectsProps> = ({
  className,
  title,
  projects = [],
  bgSrc,
  logos,
  cta,
  ctaHref,
}) => {
  let colCounter = 0;
  return (
    <section
      className={cn(
        "relative overflow-hidden text-nd-high-em-text text-left m-0",
        className,
      )}
    >
      <Container className="py-10 flex flex-col justify-between relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="xl:max-w-[70%] grow-0">
            {title && <h2 className="nd-heading-l">{title}</h2>}
          </div>
          {cta && (
            <div>
              <Button
                className="h-12 w-auto nd-body-m"
                asChild
                variant="secondary-outline"
                size="lg"
                rounded
              >
                <a
                  className="text-inherit"
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cta}
                </a>
              </Button>
            </div>
          )}
        </div>
        <div className="mt-10 xl:mt-16 rounded-2xl border-nd-border-light border-[1px] bg-nd-inverse overflow-hidden relative">
          {bgSrc && (
            <Image
              className="opacity-30 blur-[40px]"
              src={bgSrc}
              alt=""
              fill
              loading="lazy"
            />
          )}
          <Image
            className="absolute bottom-[-23px] right-[-900px] mix-blend-overlay opacity-40 max-w-none hidden xl:block"
            src="/src/img/index/pattern-parallelogram-r.svg"
            alt=""
            width={1411}
            height={283}
            loading="lazy"
          />
          <Image
            className="absolute bottom-[-100px] right-[-1000px] mix-blend-overlay max-w-none hidden xl:block"
            src="/src/img/index/pattern-parallelogram-r.svg"
            alt=""
            width={1411}
            height={283}
            loading="lazy"
          />
          <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((item, index) => {
              colCounter += item.colSpan || 1;
              return (
                <CompanyStatsCard
                  className={cn("xl:min-h-[360px] border-nd-border-light", {
                    "xl:col-span-1": item.colSpan === 1,
                    "xl:col-span-2": item.colSpan === 2,
                    "xl:col-span-3": item.colSpan === 3,
                    "xl:col-span-4": item.colSpan === 4,
                    "max-md:border-r-0 max-xl:border-r": index % 2 === 0,
                    "xl:border-r": colCounter % 4 !== 0,
                    "max-xl:border-t": index > 1,
                    "max-md:border-t": index > 0,
                    "xl:border-t": colCounter > 4,
                  })}
                  stat={item.stat}
                  statLabel={item.statLabel}
                  name={item.name}
                  key={item.name}
                  src={item.src}
                  statIcon={item.statIcon}
                  statType={item.statType}
                  hideStats={item.hideStats}
                />
              );
            })}
          </div>
        </div>
        {logos && logos.length > 0 && (
          <Logos
            className="mt-10 xl:mt-16 -mx-5 md:-mx-8 xl:-mx-10 w-auto px-5 md:px-8 xl:px-10 h-[28px] xl:h-[40px] gap-6 xl:gap-12 justify-start md:justify-between"
            itemClassName="h-full m-0"
            logos={logos}
            animation={false}
          />
        )}
      </Container>
    </section>
  );
};
