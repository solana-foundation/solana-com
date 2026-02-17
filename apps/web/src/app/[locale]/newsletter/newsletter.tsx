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
    <section className="mt-n12">
      <div className="container d-flex flex-column">
        <div className="row align-items-center justify-content-center g-0 min-vh-100">
          <div className="col-12 col-md-6 col-lg-5 py-8 py-md-11">
            <h3 className="mb-0 fw-bold text-white">{translations.signup}</h3>
            <p className="mb-6">{translations.spam}</p>
            <EmailSubscribeForm formId="fdd4a0db-f4af-4b29-90f9-98b0556d4c89" />
          </div>
        </div>
      </div>
    </section>
  );
}
