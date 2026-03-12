import { useTranslations } from "next-intl";
import HashAccordion, {
  HashAccordionItem,
} from "../sharedPageSections/HashAccordion";
import Link from "next/link";
import Image from "next/image";
import faqLogo from "../../../public/src/img/validators/validators_geometry_small2.png";

const ValidatorsFAQ = () => {
  const t = useTranslations();
  const questionsAndAnswers = t.raw("validators.qa.items");

  return (
    <section className="mt-20 min-[567px]:mt-32">
      <div className="container">
        <h2 className="mb-4 md:mb-10">{t("validators.qa.title")}</h2>

        <div className="grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 lg:col-span-8">
            <HashAccordion>
              {questionsAndAnswers.map((qa, index) => (
                <HashAccordionItem
                  key={index}
                  question={qa.question}
                  answer={t.rich(`validators.qa.items.${index}.answer`, {
                    bugreportslink: (chunks) => (
                      <Link
                        href="https://github.com/anza-xyz/agave/security"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </Link>
                    ),
                    discordlink: (chunks) => (
                      <Link href="/discord">{chunks}</Link>
                    ),
                    requirementslink: (chunks) => (
                      <Link
                        href="https://docs.anza.xyz/operations/requirements"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </Link>
                    ),
                    economicslink: (chunks) => (
                      <Link
                        href="https://docs.anza.xyz/implemented-proposals/ed_overview/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </Link>
                    ),
                    stakinglink: (chunks) => (
                      <Link href="/docs/references/economics/staking">
                        {chunks}
                      </Link>
                    ),
                    programlink: (chunks) => (
                      <Link
                        href="https://solana.org/delegation-program"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                />
              ))}
            </HashAccordion>
          </div>
          <div className="col-span-12 lg:col-span-4 hidden lg:block">
            <Image src={faqLogo} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidatorsFAQ;
