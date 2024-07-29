import Link from "../../utils/Link";
import classNames from "classnames";
import styles from "./PossibleCaseStudies.module.scss";
import { useTranslation } from "next-i18next";

const PossibleCaseStudies = () => {
  const { t } = useTranslation();
  const caseStudyCTA = t("possible.learnMore");

  return (
    <section className={styles["section__caseStudies--possible"]}>
      <div className="container-fluid pt-8 pt-md-12 pb-md-10 position-relative z-index-1">
        <div className={styles["caseStudies__card-row--possible"]}>
          <div className={styles["caseStudies__card-row-inner--possible"]}>
            <CaseStudyCard
              title={t("possible.caseStudies.case-1.title")}
              copy={t("possible.caseStudies.case-1.description")}
              cta={caseStudyCTA}
              url={"/news/case-study-hivemapper"}
            />
            <CaseStudyCard
              title={t("possible.caseStudies.case-2.title")}
              copy={t("possible.caseStudies.case-2.description")}
              cta={caseStudyCTA}
              url={"/news/case-study-helium"}
            />
            <CaseStudyCard
              title={t("possible.caseStudies.case-3.title")}
              copy={t("possible.caseStudies.case-3.description")}
              cta={caseStudyCTA}
              url={"https://drip.haus/"}
            />
            <CaseStudyCard
              title={t("possible.caseStudies.case-4.title")}
              copy={t("possible.caseStudies.case-4.description")}
              cta={caseStudyCTA}
              url={"/news/case-study-dialect"}
            />
            <CaseStudyCard
              title={t("possible.caseStudies.case-5.title")}
              copy={t("possible.caseStudies.case-5.description")}
              cta={caseStudyCTA}
              url={"/news/case-study-gainforest"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CaseStudyCard = ({ title, copy, cta, url }) => {
  return (
    <div
      className={classNames(
        styles["caseStudies__card"],
        "p-6 pb-9 position-relative ",
      )}
    >
      <Link href={url} className="d-block mb-4">
        <h3 className="h6 fw-medium mb-3 mb-md-4 text-white">{title}</h3>
      </Link>
      <p className={"copy mb-5"}>{copy}</p>
      <Link
        href={url}
        className={`cta copy fw-light mb-6 ms-6 text-uppercase text-decoration-underline position-absolute bottom-0 start-0`}
      >
        {cta}
      </Link>
    </div>
  );
};

export default PossibleCaseStudies;
