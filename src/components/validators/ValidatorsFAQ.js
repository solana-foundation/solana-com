import FAQsection from "../sharedPageSections/FAQsection";

const ValidatorFAQsTitles = [
  {
    sectionTitle: "Validating on Solana",
  },
];

/**
 * This component generates the FAQ Accordion section.
 *
 * @returns {JSX.Element}
 * @constructor
 */

const ValidatorsFAQ = ({ validatorFAQs }) => {
  return (
    <section className="mt-12">
      <div className="container">
        <FAQsection data={validatorFAQs} titles={ValidatorFAQsTitles} />
      </div>
    </section>
  );
};

export default ValidatorsFAQ;
