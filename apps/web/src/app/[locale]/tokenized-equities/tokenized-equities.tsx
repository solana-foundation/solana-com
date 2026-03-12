"use client";

import { Section, Switchback } from "@solana-foundation/solana-lib";
import { SWITCHBACK, SWITCHBACK_BUTTON } from "@/data/tokenized-equities";

interface TokenizedEquitiesPageProps {
  translations: {
    switchbackEyebrow: string;
    switchbackHeadline: string;
    switchbackBody: string;
    switchbackButtonLabel: string;
    switchbackPlaceholder: string;
    switchbackEmailError: string;
    switchbackSubmitError: string;
    switchbackSuccessMessage: string;
  };
}

export function TokenizedEquitiesPage({
  translations,
}: TokenizedEquitiesPageProps) {
  const switchbackButtons = [
    {
      ...SWITCHBACK_BUTTON,
      label: translations.switchbackButtonLabel,
    },
  ];

  return (
    <Section>
      <Switchback
        assetSide={SWITCHBACK.assetSide as any}
        image={SWITCHBACK.image}
        eyebrow={translations.switchbackEyebrow}
        headline={translations.switchbackHeadline}
        body={translations.switchbackBody}
        placeholder={translations.switchbackPlaceholder}
        emailError={translations.switchbackEmailError}
        submitError={translations.switchbackSubmitError}
        successMessage={translations.switchbackSuccessMessage}
        newsLetter={SWITCHBACK.newsLetter}
        formId={SWITCHBACK.formId}
        buttons={
          switchbackButtons as React.ComponentProps<
            typeof Switchback
          >["buttons"]
        }
      />
    </Section>
  );
}
