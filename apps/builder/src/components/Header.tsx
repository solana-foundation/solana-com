import { getTranslations } from "@workspace/i18n/server";
import LogoHorizontal from "@@/src/assets/logo-horizontal.inline.svg";
import { links } from "@@/src/content/links";
import { CtaLink } from "./CtaLink";
import { container } from "./layout";
import { HeaderBar } from "./motion";

const NAV = [
  { id: "about", key: "about" },
  { id: "get-involved", key: "getInvolved" },
  { id: "faq", key: "faq" },
] as const;

export async function Header({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder" });

  return (
    <HeaderBar>
      <div
        className={`${container} flex h-[68px] items-center gap-4 max-[339px]:gap-2`}
      >
        <a
          href="#top"
          aria-label={t("nav.home")}
          className="mr-auto block shrink-0"
        >
          <LogoHorizontal
            className="h-[28px] w-auto max-[339px]:h-[22px] md:h-[34px]"
            aria-hidden
          />
        </a>
        <nav aria-label={t("nav.label")} className="hidden md:block">
          <ul className="flex items-center gap-7 text-[16px] leading-none tracking-[-0.5px]">
            {NAV.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-ink/65 transition-colors hover:text-ink"
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <CtaLink
          href={links.register}
          pendingLabel={t("cta.pending")}
          className="h-10 bg-bldr-purple px-4 text-[14px] leading-none tracking-[-0.4px] text-surface"
          hoverClassName="hover:bg-[rgb(var(--bldr-btn-hover))]"
        >
          {t("cta.register")}
        </CtaLink>
      </div>
    </HeaderBar>
  );
}
