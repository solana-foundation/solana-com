import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import { localizedRoutePath, routePath } from "@/config";
import HereForSubpage from "@/components/pages/here-for/HereForSubpage";
import { openXConfirm } from "@/lib/here-for/x-auth";
import { getPageMetadata } from "@/app/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });
  return getPageMetadata(locale, {
    path: "/mutuals/confirm",
    title: t("confirm.metadataTitle"),
    description: t("confirm.description"),
    noindex: true,
  });
}

/**
 * Shown when X sent the sign-in callback to a browser that did not start it
 * (typically the X app opening a different browser on a phone). The identity
 * is already verified; the visitor just confirms it is theirs.
 */
export default async function HereForConfirmSignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });
  const confirmed = openXConfirm(typeof token === "string" ? token : null);
  const signInAgain = `${routePath("/api/here-for/x/login")}?return=${encodeURIComponent(
    localizedRoutePath(locale, "/mutuals/add"),
  )}`;

  return (
    <HereForSubpage locale={locale}>
      <section className="bg-black pb-3xl pt-[120px] md:pb-4xl md:pt-[136px]">
        <div className="mx-auto w-full max-w-[640px] px-4 text-white md:px-8">
          {confirmed ? (
            <form
              method="post"
              action={routePath("/api/here-for/x/confirm")}
              className="flex flex-col gap-6"
            >
              <h1 className="text-3xl font-medium md:text-4xl">
                {t("confirm.title")}
              </h1>
              <p className="text-white/70">{t("confirm.description")}</p>
              <input
                type="hidden"
                name="token"
                value={typeof token === "string" ? token : ""}
              />
              <button
                type="submit"
                className="rounded-full bg-white px-6 py-3 text-base font-medium text-black hover:bg-white/90"
              >
                {t("confirm.continueAs", { handle: confirmed.session.handle })}
              </button>
              <a
                href={localizedRoutePath(locale, "/mutuals")}
                className="text-sm text-white/70 underline-offset-4 hover:underline"
              >
                {t("confirm.cancel")}
              </a>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-medium md:text-4xl">
                {t("confirm.expiredTitle")}
              </h1>
              <p className="text-white/70">{t("confirm.expiredDescription")}</p>
              <a
                href={signInAgain}
                className="w-fit rounded-full bg-white px-6 py-3 text-base font-medium text-black hover:bg-white/90"
              >
                {t("confirm.signInAgain")}
              </a>
            </div>
          )}
        </div>
      </section>
    </HereForSubpage>
  );
}
