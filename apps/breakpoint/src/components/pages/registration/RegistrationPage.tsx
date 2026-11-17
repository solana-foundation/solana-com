import { getTranslations } from "@workspace/i18n/server";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import RegistrationTicketButton from "@/components/pages/registration/RegistrationTicketButton";
import SubpageHero from "@/components/SubpageHero";
import { NEXT_EDITION } from "@/content/next-edition";

const REGISTRATION_MARQUEE_HIGHLIGHTS = [
  NEXT_EDITION.shortName,
  "FLASH SALE",
  "BUILD",
  "DEPLOY",
  "SHIP MORE",
];

/**
 * Registration for the next edition: the flash sale ticket beside the
 * announcement video, then the email signup for dates and location. Every
 * edition fact comes from `src/content/next-edition.ts`.
 */
export default async function RegistrationPage({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "breakpoint.pages.registration.next",
  });
  const tSignup = await getTranslations({
    locale,
    namespace: "breakpoint.nextEdition",
  });
  const { flashSalePrice, registrationHref, shortName, signupFormId, videoId } =
    NEXT_EDITION;
  const year = NEXT_EDITION.year;
  const registerLabel = tSignup("registerCta", { shortName });

  return (
    <PageShell
      contentId="registration-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: registrationHref,
        ctaLabel: registerLabel,
        showMenuButton: true,
      }}
    >
      <SubpageHero
        eyebrow={t("eyebrow", { year })}
        heroImage="registration"
        title={t("heroTitle", { year })}
      />
      <Marquee
        highlightClassName="text-green"
        highlights={REGISTRATION_MARQUEE_HIGHLIGHTS}
      />

      <section className="bg-black pt-2xl md:pt-[120px]">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-xs md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8">
          <article className="flex flex-col gap-xl bg-purple p-6 text-black md:justify-between md:gap-l md:p-8">
            <div className="flex flex-col gap-1">
              <h2 className="type-p-large-bold text-black">
                {t("ticket.title")}
              </h2>
              <p className="type-paragraph text-black opacity-80">
                {t("ticket.description", { year })}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:gap-3">
              <p className="type-h2 text-black">{flashSalePrice}</p>
              <RegistrationTicketButton
                href={registrationHref}
                label={registerLabel}
                tone="dark"
              />
            </div>
          </article>

          {videoId && (
            <div className="relative aspect-video w-full self-start overflow-hidden bg-neutral-800">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
                title={tSignup("videoTitle", { year })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )}
        </div>
      </section>

      {signupFormId && (
        <section className="bg-black pt-2xl md:pt-[120px]">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-m px-xs md:flex-row md:items-end md:justify-between md:gap-l md:px-8">
            <div className="flex flex-col gap-2xs md:max-w-[582px]">
              <p className="type-eyebrow text-white">{t("updates.eyebrow")}</p>
              <h2 className="type-h3 text-white">{t("updates.headline")}</h2>
              <p className="type-p-large text-text-secondary">
                {tSignup("signup.body", { year })}
              </p>
            </div>
            <EmailSubscribeForm
              className="w-full md:max-w-[560px]"
              formId={signupFormId}
              layout="inline"
              placement="registration_page"
              labels={{
                emailLabel: tSignup("signup.emailLabel"),
                emailPlaceholder: tSignup("signup.emailPlaceholder"),
                submit: tSignup("signup.submit"),
                submitting: tSignup("signup.submitting"),
                success: tSignup("signup.success"),
                error: tSignup("signup.error"),
              }}
            />
          </div>
        </section>
      )}
      <Footer />
    </PageShell>
  );
}
