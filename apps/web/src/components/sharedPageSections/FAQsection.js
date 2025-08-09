import slugify from "@sindresorhus/slugify";
import { memo, useContext } from "react";
import Image from "next/legacy/image";
import styled from "styled-components";
import { Accordion, AccordionContext, Card } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";

import CommonMarkdown from "./CommonMarkdown";
import Button from "../shared/Button";
import Divider from "../shared/Divider";
import HashAccordion from "../sharedPageSections/HashAccordion";

import ChevronDown from "../../../public/src/img/icons/Angle-down.inline.svg";

import faqLogo from "../../../public/src/img/validators/validators_geometry_small2.png";

const StyledFAQSection = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;
  @media (min-width: 992px) {
    column-gap: 2rem;
  }
  @media (min-width: 1100px) {
    column-gap: 4.5rem;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .faq-logo {
    display: none;
    margin-top: 2rem;
    @media (min-width: 768px) {
      display: block;
      width: 250px;
    }
    @media (min-width: 992px) {
      width: 290px;
    }
    @media (min-width: 1100px) {
      width: 328px;
    }
  }
`;

export const FAQWrapper = styled.div`
  & > div:not(:first-child) {
    margin-top: 6rem;
  }

  .card {
    background: none;
    color: white !important;
  }
  .card-header {
    font-size: 1.5rem;
    line-height: 1.75rem;
    padding: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;

    &.showing {
      color: #9945ff;
    }
  }
  .card-body {
    border-radius: 0;
    padding: 0 0 2rem;
    & > p {
      margin-bottom: 0;
      font-size: 1.125rem;
      line-height: 130%;
      color: #ffffff;
      @media (min-width: 567px) {
        font-size: 1.3125rem;
      }
    }
  }

  .collapse-chevron {
    flex: none;
    transition: transform 0.2s ease-in-out;
  }

  // Turn Chevron when card is open.
  [aria-expanded="true"] .collapse-chevron {
    color: #9945ff;
    transform: rotate(-180deg) !important;
  }

  a:focus {
    color: #14f195;
  }
`;

const FAQToggle = ({ children, eventKey, callback }) => {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Card.Header
      aria-expanded={isCurrentEventKey && true}
      className={isCurrentEventKey && "showing"}
      onClick={decoratedOnClick}
    >
      <h4 className="h6 m-0 fw-normal">{children}</h4>
      <ChevronDown className="collapse-chevron" />
    </Card.Header>
  );
};

export const FAQItem = memo(function FAQItem({ title, content, prefix }) {
  const slug = slugify(title);
  const accordionKey = prefix ? `${prefix}/${slug}` : slug;

  return (
    <Card data-id={slug} key={slug}>
      <FAQToggle eventKey={accordionKey}>{title}</FAQToggle>
      <Accordion.Collapse eventKey={accordionKey}>
        <Card.Body>
          <CommonMarkdown>{content}</CommonMarkdown>
        </Card.Body>
      </Accordion.Collapse>
      <Divider theme="light" axis="x" />
    </Card>
  );
});

const FAQContent = ({
  sectionTitle,
  sectionId,
  sectionItems,
  buttonText,
  buttonUrl,
  hiddenTitle,
  hiddenLogo,
}) => (
  <StyledFAQSection>
    <div className="content">
      <div>
        {!hiddenTitle && (
          <h3 className="h4 fw-normal" id={sectionId}>
            {sectionTitle}
          </h3>
        )}
        {buttonText && (
          <Button to={buttonUrl} variant="secondary" arrow={true}>
            {buttonText}
          </Button>
        )}
      </div>
      <div>
        <HashAccordion prefix={sectionId}>
          {sectionItems.map(({ itemTitle, itemContent }) => (
            <FAQItem key={itemTitle} title={itemTitle} content={itemContent} />
          ))}
        </HashAccordion>
      </div>
    </div>
    {!hiddenLogo && (
      <div className="faq-logo">
        <Image src={faqLogo} alt="faq-logo" quality={90} />
      </div>
    )}
  </StyledFAQSection>
);

const FAQsection = ({
  data,
  titles,
  hiddenTitle = false,
  hiddenLogo = false,
  className = "",
}) => {
  const faqs = titles.map((sectionData) => {
    const sectionItems = data.reduce((acc, faqItem) => {
      if (faqItem.frontmatter.section === sectionData.sectionTitle) {
        const currentFAQItem = {
          slug: faqItem.frontmatter.slug,
          itemTitle: faqItem.frontmatter.title,
          itemContent: faqItem.content,
        };
        acc.push(currentFAQItem);
      }
      return acc;
    }, []);
    const currentSection = {
      sectionItems: sectionItems,
      ...sectionData,
    };
    return currentSection;
  });

  return (
    <section className={className}>
      <FAQWrapper>
        {faqs.map((sectionData) => (
          <FAQContent
            key={sectionData.sectionTitle.replace(" ", "-")}
            {...sectionData}
            hiddenTitle={hiddenTitle}
            hiddenLogo={hiddenLogo}
          />
        ))}
      </FAQWrapper>
    </section>
  );
};

export default FAQsection;
