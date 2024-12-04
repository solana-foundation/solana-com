import { useTranslation, Trans } from "next-i18next";
import HashAccordion, {
  HashAccordionItem,
} from "../sharedPageSections/HashAccordion";
import Link from "next/link";
import Image from "next/image";
import faqLogo from "../../../public/src/img/validators/validators_geometry_small2.png";

const ValidatorsFAQ = () => {
  const { t } = useTranslation("common");
  const questionsAndAnswers = t("validators.qa.items", { returnObjects: true });

  return (
    <section className="mt-12">
      <div className="container">
        <h2 className="mb-4 mb-md-7">{t("validators.qa.title")}</h2>

        <div className="row">
          <div className="col-lg-8">
            <HashAccordion>
              {questionsAndAnswers.map((qa, index) => (
                <HashAccordionItem
                  key={index}
                  question={qa.question}
                  answer={
                    <Trans
                      i18nKey={qa.answer}
                      components={{
                        bugreportslink: (
                          <Link href="https://github.com/anza-xyz/agave/security" />
                        ),
                        discordlink: <Link href="/discord" />,
                        requirementslink: (
                          <Link href="https://docs.anza.xyz/operations/requirements" />
                        ),
                        economicslink: (
                          <Link href="https://docs.anza.xyz/implemented-proposals/ed_overview/" />
                        ),
                        stakinglink: <Link href="/docs/economics/staking" />,
                        programlink: (
                          <Link href="https://solana.org/delegation-program" />
                        ),
                      }}
                    />
                  }
                />
              ))}
            </HashAccordion>
          </div>
          <div className="col-lg-4 d-none d-lg-block">
            <Image src={faqLogo} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidatorsFAQ;
