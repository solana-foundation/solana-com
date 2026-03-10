import { forwardRef, useState } from "react";
import { AccordionItem, AccordionContent, Accordion } from "@workspace/ui";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import classNames from "classnames";
import styles from "./PossibleInnovations.module.scss";
import { useTranslations } from "next-intl";
import PossibleAnimatedIcons from "./PossibleAnimatedIcons";

const InnovationAccordion = forwardRef(
  ({ title, image, imageAlt, animatedIcon, children, index, color }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const t = useTranslations();

    return (
      <div ref={ref}>
        <div
          className={classNames(
            styles["accordion__image--possible"],
            "w-full h-auto mx-auto mb-10 mt-10 block md:hidden",
          )}
        >
          <PossibleAnimatedIcons
            videoSrc={animatedIcon}
            fallbackImage={image}
            fallbackImageAlt={imageAlt}
          />
        </div>
        <Accordion onValueChange={() => setIsExpanded((state) => !state)}>
          <AccordionItem
            value={String(index)}
            className={[styles["accordion-item"], "pb-4 md:pb-20"].join(" ")}
            style={{ "--accordion-color": color, background: "transparent" }}
          >
            <div
              className={classNames(
                styles["accordion__divider--possible"],
                `mb-4 md:mb-10 ${isExpanded ? "open" : null}`,
              )}
            />
            <div className="md:flex">
              <div className="w-full md:w-1/4">
                <div
                  className={classNames(
                    styles["accordion__image--possible"],
                    "w-full h-auto md:-ml-3 mb-4 hidden md:block",
                  )}
                >
                  <PossibleAnimatedIcons
                    videoSrc={animatedIcon}
                    fallbackImage={image}
                    fallbackImageAlt={imageAlt}
                  />
                </div>
              </div>
              <div
                className="accordion-header w-full sm:w-3/4 md:pl-8"
                id={`panelsStayOpen-heading${index}`}
              >
                <h2 className="h6 font-semibold mb-3 md:mb-4 text-white">
                  {title}
                </h2>
                {!isExpanded && (
                  <>
                    <p className={`truncated copy mb-0`}>{children}</p>
                    <AccordionTrigger asChild>
                      <button className="bg-transparent p-4 -ml-4 border-0 md:pb-8">
                        <p
                          className="copy underline mb-0"
                          style={{ WebkitFontSmoothing: "antialiased" }}
                        >
                          {t("possible.readMore")}
                        </p>
                      </button>
                    </AccordionTrigger>
                  </>
                )}
                <AccordionContent>
                  <p className="copy mb-0 md:pb-12">{children}</p>
                </AccordionContent>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
);

export default InnovationAccordion;
