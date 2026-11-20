import { getTranslations } from "@workspace/i18n/server";
import {
  DOCS_FOOTER_SOCIALS,
  getDocsFooterColumns,
} from "@/data/developers/docs-nav";
import { localizedHref } from "@/data/developers/hub";
import {
  DocsSocialGlyph,
  SOCIAL_ICONS,
  SocialIcon,
  SolanaLogo,
} from "./docs-icons";

/**
 * The docs footer, shared by /developers and the docs: logo and socials,
 * then the link columns from docs.json `footer`, then a hairline and the
 * legal links. Styles in docs-chrome.css ("Docs footer") and
 * components/docs/docs.css ("Footer").
 */

export async function DocsFooter({
  locale,
  developers = false,
}: {
  locale: string;
  /** The "Solana Developers" logo, as on the docs pages. */
  developers?: boolean;
}) {
  const t = await getTranslations({
    locale,
    namespace: "developers.landing.footer",
  });
  const columns = getDocsFooterColumns(locale);

  return (
    <footer className="df" aria-label={t("label")}>
      <div className="df-inner">
        <div className="df-top">
          <div className="df-brand">
            <a
              href={locale === "en" ? "/" : `/${locale}`}
              className="df-logo"
              aria-label="Solana"
            >
              <SolanaLogo gradientId="df-logo-g" developers={developers} />
            </a>
            <ul className="df-socials" aria-label={t("socials")}>
              {DOCS_FOOTER_SOCIALS.map(({ id, href }) => {
                const name = SOCIAL_ICONS[id]?.name;
                if (!name) return null;
                return (
                  <li key={id}>
                    <a
                      href={href}
                      aria-label={name}
                      title={name}
                      rel="noopener noreferrer"
                    >
                      {developers ? (
                        <DocsSocialGlyph id={id} />
                      ) : (
                        <SocialIcon id={id} />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="df-columns">
            {columns.map((column) => (
              <nav key={column.header} aria-label={column.header}>
                <p className="df-heading">{column.header}</p>
                <ul>
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="df-bottom">
          <p>{t("copyright", { year: String(new Date().getFullYear()) })}</p>
          {developers ? null : (
            <ul>
              <li>
                <a href={localizedHref(locale, "/privacy-policy")}>
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href={localizedHref(locale, "/tos")}>{t("terms")}</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
