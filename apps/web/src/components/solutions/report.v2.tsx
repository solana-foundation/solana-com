import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowDownToLine, ChevronRight } from "lucide-react";
import UnicornScene from "unicornstudio-react";

export type SolutionReportLink = {
  title: string;
  href: string;
};

export type SolutionReportProps = {
  eyebrow?: string;
  description?: string;
  emailCta?: string;
  onEmailClick?: () => void;
  imgSrc?: string;
  links?: SolutionReportLink[];
  linksTitle?: string;
  bgJsonFilePath?: string;
};

/**
 * Displays a report section with a title, description, email CTA, and links.
 *
 * @component
 * @param {SolutionReportProps} props - The props for the component.
 * @param {string} props.eyebrow - The eyebrow of the report.
 * @param {string} props.description - The description of the report.
 * @param {string} props.emailCta - The email CTA.
 * @param {() => void} props.onEmailClick - The function to call when the email CTA is clicked.
 * @param {string} props.imgSrc - The source of the report image.
 * @param {SolutionReportLink[]} props.links - The links to display in the report.
 * @param {string} props.linksTitle - The title of the links.
 * @param {string} props.bgJsonFilePath - The path to the background JSON file.
 *
 * @example
 * <SolutionReport
 *   eyebrow="Report Eyebrow"
 *   description="Report Description"
 *   emailCta="Email CTA"
 *   onEmailClick={() => {}}
 *   imgSrc="https://example.com/report-image.png"
 *   links={[
 *     { title: "Link 1", href: "https://example.com/link1" },
 *     { title: "Link 2", href: "https://example.com/link2" },
 *   ]}
 *   linksTitle="Links Title"
 *   bgJsonFilePath="https://example.com/background.json"
 * />
 */
export const SolutionReport: React.FC<SolutionReportProps> = ({
  eyebrow,
  description,
  emailCta,
  onEmailClick,
  imgSrc,
  links,
  linksTitle,
  bgJsonFilePath,
}) => {
  if (!emailCta || !onEmailClick) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-black text-white text-left">
      <div className="!absolute m-auto max-xl:top-2 max-xl:right-2 max-xl:bottom-2 max-xl:left-2 xl:top-10 xl:bottom-10 xl:right-10 xl:left-10">
        <UnicornScene
          className="!absolute top-0 right-0 bottom-0 left-0 rounded-xl overflow-hidden"
          width="100%"
          height="100%"
          jsonFilePath={bgJsonFilePath}
          scale={1}
          dpi={1}
          fps={30}
          lazyLoad={true}
          production={true}
        />
      </div>
      <div className="py-[64px] md:py-[112px] xl:py-[160px] relative">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] mb-[32px] xl:mb-[48px]">
          <div className="flex flex-col md:flex-row items-stretch max-xl:gap-6 xl:gap-14">
            {imgSrc && (
              <div className="grow-0 shrink-0">
                <Image
                  src={imgSrc}
                  alt=""
                  width={290}
                  height={288}
                  className="!h-auto w-[80px] md:w-[190px] xl:w-[290px] rounded-md"
                  quality={100}
                />
              </div>
            )}
            <div className="grow flex flex-col justify-between gap-4">
              <div>
                {eyebrow && (
                  <h3 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] m-0 max-w-xl tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
                    {eyebrow}
                  </h3>
                )}
                {description && (
                  <p className="text-lg md:text-2xl text-white opacity-[0.64] max-md:mt-2 md:mt-6 mb-0 max-w-md tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                    {description}
                  </p>
                )}
              </div>
              <div>
                <Button
                  className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                  size="lg"
                  aria-label={emailCta}
                  onClick={onEmailClick}
                >
                  <ArrowDownToLine
                    aria-hidden={true}
                    className="-ml-2 p-1 !size-6 bg-black text-white rounded-full"
                    strokeWidth={3}
                  />
                  {emailCta}
                </Button>
              </div>
            </div>
          </div>

          {/* Fallback to original links layout */}
          {links && (
            <div className="max-xl:mt-16 max-xl:pt-16 xl:mt-24 xl:pt-24 border-t border-white/10">
              {linksTitle && (
                <h3 className="font-brand font-medium text-[18px] md:text-[32px] xl:text-[36px] mt-0 mb-[2rem] tracking-[-0.54px] md:tracking-[-0.96px] xl:tracking-[-1.08px] leading-[1.33] md:leading-[1.25] xl:leading-[1.22]">
                  {linksTitle}
                </h3>
              )}
              <div className="flex flex-col xl:flex-row gap-1">
                {links.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="group flex-1 relative flex max-xl:flex-row xl:flex-col max-xl:p-3 xl:p-6 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-300 backdrop-blur-sm xl:min-h-48 text-inherit"
                  >
                    <div className="xl:w-8 xl:h-8 max-xl:w-6 max-xl:h-6 md:mt-1 shrink-0 grow-0 bg-none rounded-full flex items-center justify-center text-white border-[1px] border-white group-hover:bg-white group-hover:!text-black mr-3">
                      <span className="text-sm font-medium leading-8">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-brand text-base md:text-2xl font-medium xl:mt-5 xl:mb-5 max-xl:mb-0 flex-grow tracking-[-0.48px] md:tracking-[-0.72px] leading-[1.5] md:leading-[1.33]">
                      {item.title}
                    </h3>
                    <div className="xl:absolute xl:bottom-6 xl:left-6 opacity-50 max-xl:m-auto">
                      <ChevronRight className="w-4 h-4 xl:w-6 xl:h-6 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
