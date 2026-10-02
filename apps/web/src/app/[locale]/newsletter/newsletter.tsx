"use client";

import { SOLANA_NEWSLETTER_FORM_ID } from "@solana-com/ui-chrome/iterable";
import EmailSubscribeForm from "@/components/shared/EmailSubscribeForm";

interface NewsletterPageProps {
  translations: {
    signup: string;
    spam: string;
  };
}

export function NewsletterPage({ translations }: NewsletterPageProps) {
  return (
    <section className="-mt-32">
      <div className="container flex flex-col">
        <div className="grid grid-cols-12 items-center justify-center min-h-screen">
          <div className="col-span-12 md:col-span-6 lg:col-span-5 py-12 md:py-24">
            <h3 className="mb-0 font-bold text-white">{translations.signup}</h3>
            <p className="mb-6">{translations.spam}</p>
            <EmailSubscribeForm formId={SOLANA_NEWSLETTER_FORM_ID} />
          </div>
        </div>
      </div>
    </section>
  );
}
