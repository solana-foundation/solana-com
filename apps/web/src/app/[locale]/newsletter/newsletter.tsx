"use client";

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
            <EmailSubscribeForm formId="fdd4a0db-f4af-4b29-90f9-98b0556d4c89" />
          </div>
        </div>
      </div>
    </section>
  );
}
