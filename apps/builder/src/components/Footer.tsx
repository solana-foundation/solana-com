import { getTranslations } from "@workspace/i18n/server";
import { getImagePath } from "@@/src/config";
import { FooterSignup } from "./FooterSignup";
import { container, label } from "./layout";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder.footer" });

  return (
    <footer className="surface-black">
      <div className={`${container} pt-14`}>
        <FooterSignup
          labels={{
            heading: t("signup.heading"),
            placeholder: t("signup.placeholder"),
            submit: t("signup.submit"),
            success: t("signup.success"),
            error: t("signup.error"),
          }}
        />
      </div>
      <div
        className={`${container} flex flex-col gap-12 pb-9 pt-10 md:flex-row md:items-end md:justify-between`}
      >
        <img
          src={getImagePath("/images/logo-stacked.svg")}
          alt={t("logoAlt")}
          width={300}
          height={192}
          loading="lazy"
          decoding="async"
          className="h-auto w-[200px] md:w-[300px]"
        />
        <div className="flex flex-col gap-[9px] md:items-end">
          <a href="https://solana.com" className="block w-[150px]">
            <img
              src={getImagePath("/images/logo-solana.svg")}
              alt={t("solanaAlt")}
              width={150}
              height={23}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </a>
          <p className={`${label} text-ink/65`}>
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
