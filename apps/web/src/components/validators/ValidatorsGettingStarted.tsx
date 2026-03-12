import Button from "../shared/Button";
import { useTranslations } from "next-intl";

const CARDS = [
  {
    background: "#AB66FF",
    headerKey: "validators.getting-started.cards.docs-header",
    textKey: "validators.getting-started.cards.docs-text",
    buttons: [
      {
        to: "https://docs.anza.xyz/operations",
        ariaLabel: "Solana Docs",
        labelKey: "commands.gtdocs",
        variant: "none" as const,
        arrow: true,
      },
    ],
  },
  {
    background: "#14F195",
    headerKey: "validators.getting-started.cards.explorer-header",
    textKey: "validators.getting-started.cards.explorer-text",
    buttons: [
      {
        to: "https://solanabeach.io/validators",
        ariaLabel: "Solanabeach",
        labelKey: "validators.getting-started.cards.explorer-btn",
        variant: "none" as const,
        arrow: true,
      },
    ],
  },
  {
    background: "#EB54BC",
    headerKey: "validators.getting-started.cards.education-header",
    textKey: "validators.getting-started.cards.education-text",
    buttons: [
      {
        to: "https://www.youtube.com/watch?v=b0-vMyoojuo&list=PLilwLeBwGuK6jKrmn7KOkxRxS9tvbRa5p",
        ariaLabel: "Solana Validator Education",
        labelKey: "commands.learn",
        variant: "none" as const,
        arrow: true,
      },
    ],
  },
  {
    background: "#FF754A",
    headerKey: "validators.getting-started.cards.delegation-header",
    textKey: "validators.getting-started.cards.delegation-text",
    buttons: [
      {
        to: "https://solana.org/delegation-program",
        ariaLabel: "Solana Foundation delegation program",
        labelKey: "commands.learn",
        variant: "none" as const,
        className: "mt-2 mr-2",
      },
      {
        to: "https://solana.org/validators-search",
        ariaLabel: "Delegation Dashboard",
        labelKey: "validators.getting-started.cards.delegation-btn",
        variant: "transparent" as const,
        arrow: true,
        className: "mt-2",
      },
    ],
  },
];

const ValidatorsGettingStarted = () => {
  const t = useTranslations();

  return (
    <section className="mt-20 min-[567px]:mt-32">
      <div className="container">
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] md:grid-cols-2">
          {CARDS.map((card) => (
            <div
              key={card.headerKey}
              className="rounded-xl p-4 flex flex-col justify-between min-h-[300px] min-[567px]:p-6 min-[567px]:min-h-[360px]"
              style={{ background: card.background }}
            >
              <div>
                <h2 className="text-black section-title overflow-wrap-break-word">
                  {t(card.headerKey)}
                </h2>
                <p className="clamp text-black mt-2">{t(card.textKey)}</p>
              </div>
              <div className="flex flex-wrap">
                {card.buttons.map((btn) => (
                  <Button
                    key={btn.to}
                    to={btn.to}
                    newTab
                    aria-label={btn.ariaLabel}
                    variant={btn.variant}
                    arrow={btn.arrow}
                    className={btn.className}
                  >
                    {t(btn.labelKey)}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValidatorsGettingStarted;
