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
            "w-100 h-auto mx-auto mb-7 mt-7 d-block d-md-none",
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
            className={[styles["accordion-item"], `pb-4 pb-md-10`].join(" ")}
            style={{ "--accordion-color": color, background: "transparent" }}
          >
            <div
              className={classNames(
                styles["accordion__divider--possible"],
                `mb-4 mb-md-7 ${isExpanded ? "open" : null}`,
              )}
            />
            <div className={`d-md-flex`}>
              <div className={`col-3`}>
                <div
                  className={classNames(
                    styles["accordion__image--possible"],
                    "w-100 h-auto ms-md-n3 mb-4 d-none d-md-block",
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
                className="accordion-header col-12 col-sm-9 ps-md-6"
                id={`panelsStayOpen-heading${index}`}
              >
                <h2 className="h6 fw-semibold mb-3 mb-md-4 text-white">
                  {title}
                </h2>
                {!isExpanded && (
                  <>
                    <p className={`truncated copy mb-0`}>{children}</p>
                    <AccordionTrigger asChild>
                      <button
                        className={`bg-transparent p-4 ms-n4 border-0 pb-md-6`}
                      >
                        <p
                          className={"copy text-decoration-underline mb-0"}
                          style={{ WebkitFontSmoothing: "antialiased" }}
                        >
                          {t("possible.readMore")}
                        </p>
                      </button>
                    </AccordionTrigger>
                  </>
                )}
                <AccordionContent>
                  <p className={"copy mb-0 pb-md-8"}>{children}</p>
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
