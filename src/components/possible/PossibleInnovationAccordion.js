import { forwardRef, useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import classNames from "classnames";
import styles from "./PossibleInnovations.module.scss";
import { useTranslation } from "next-i18next";
import { AccordionContext } from "react-bootstrap";
import PossibleAnimatedIcons from "./PossibleAnimatedIcons";

const AccordionButton = ({ eventKey, onToggle, children }) => {
  const onClick = useAccordionButton(eventKey, onToggle);

  return (
    <button
      onClick={onClick}
      className={`bg-transparent p-4 ms-n4 border-0 pb-md-6`}
    >
      {children}
    </button>
  );
};

const InnovationAccordion = forwardRef(
  ({ title, image, imageAlt, animatedIcon, children, index, color }, ref) => {
    const accordionContext = useContext(AccordionContext);
    const isExpanded =
      accordionContext?.activeEventKey?.includes(index) || false;
    const { t } = useTranslation();

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
        <Accordion.Item
          eventKey={index}
          className={[styles["accordion-item"], `pb-4 pb-md-10`]}
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
                  <AccordionButton eventKey={index}>
                    <p
                      className={"copy text-decoration-underline mb-0"}
                      style={{ WebkitFontSmoothing: "antialiased" }}
                    >
                      {t("possible.readMore")}
                    </p>
                  </AccordionButton>
                </>
              )}
              <Accordion.Collapse eventKey={index}>
                <p className={"copy mb-0 pb-md-8"}>{children}</p>
              </Accordion.Collapse>
            </div>
          </div>
        </Accordion.Item>
      </div>
    );
  },
);

export default InnovationAccordion;
