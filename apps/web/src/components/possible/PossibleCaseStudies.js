import Link from "../../utils/Link";
import classNames from "classnames";
import styles from "./PossibleCaseStudies.module.scss";
import { useTranslations } from "next-intl";

const PossibleCaseStudies = () => {
  const t = useTranslations();
  const caseStudyCTA = t("possible.learnMore");

  return (
    <section className={styles["section__caseStudies--possible"]}>
      <div className="container-fluid pt-12 md:pt-32 md:pb-20 relative z-[1]">
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
      className={classNames(styles["caseStudies__card"], "p-8 pb-16 relative")}
    >
      <Link href={url} className="block mb-4">
        <h3 className="h6 font-medium mb-3 md:mb-4 text-white">{title}</h3>
      </Link>
      <p className="copy mb-6">{copy}</p>
      <Link
        href={url}
        className="cta copy font-light mb-8 ml-8 uppercase underline absolute bottom-0 left-0"
      >
        {cta}
      </Link>
    </div>
  );
};

export default PossibleCaseStudies;
