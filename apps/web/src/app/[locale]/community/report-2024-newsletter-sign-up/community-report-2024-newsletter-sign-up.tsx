"use client";

import { Section, Switchback } from "@solana-foundation/solana-lib";
import { SWITCHBACK } from "@/data/community/report-2024-newsletter-sign-up";

interface CommunityReport2024NewsletterSignUpPageProps {
  translations: {
    switchbackEyebrow: string;
    switchbackHeadline: string;
    switchbackBody: string;
    switchbackPlaceholder: string;
    switchbackEmailError: string;
    switchbackSubmitError: string;
    switchbackSuccessMessage: string;
  };
}

export function CommunityReport2024NewsletterSignUpPage({
  translations,
}: CommunityReport2024NewsletterSignUpPageProps) {
  return (
    <Section>
      <Switchback
        assetSide={SWITCHBACK.assetSide as any}
        image={SWITCHBACK.image}
        eyebrow={translations.switchbackEyebrow}
        headline={translations.switchbackHeadline}
        body={translations.switchbackBody}
        newsLetter={SWITCHBACK.newsLetter}
        formId={SWITCHBACK.formId}
        placeholder={translations.switchbackPlaceholder}
        emailError={translations.switchbackEmailError}
        submitError={translations.switchbackSubmitError}
        successMessage={translations.switchbackSuccessMessage}
      />
    </Section>
  );
}
