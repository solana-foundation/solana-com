import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

const base = "/src/img/branding/";
const logos = [
  {
    key: "mainLogoType",
    file: "solanaLogo",
    alt: "Official Solana horizontal logo",
    width: 646,
    height: 96,
  },
  {
    key: "logomark",
    file: "solanaLogoMark",
    alt: "Official Solana gradient logomark",
    width: 101,
    height: 88,
  },
  {
    key: "wordmark",
    file: "solanaWordMark",
    alt: "Official Solana wordmark",
    width: 524,
    height: 80,
  },
  {
    key: "vertical",
    file: "solanaVerticalLogo",
    alt: "Official Solana vertical logo",
    width: 477,
    height: 206,
  },
  {
    key: "foundation",
    file: "solanaFoundationLogo",
    alt: "Official Solana Foundation logo",
    width: 682,
    height: 111,
  },
] as const;

const banned = [
  { file: "bannedLogos-1.svg", key: "shadow", bg: "bg-[#9945FF]" },
  { file: "bannedLogos-2.png", key: "outline", bg: "bg-[#9945FF]" },
  { file: "bannedLogos-3.svg", key: "stretch", bg: "bg-white" },
  { file: "bannedLogos-4.svg", key: "blur", bg: "bg-white" },
  { file: "bannedLogos-5.svg", key: "imagery", bg: "bg-white" },
  { file: "bannedLogos-6.svg", key: "contrast", bg: "bg-[#6D86D1]" },
] as const;

const outlineLink =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 py-2 font-brand-mono text-sm uppercase text-white transition-colors hover:border-solana-green hover:text-solana-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solana-green";
const textLink =
  "text-solana-green underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-solana-green";

export async function BrandingPage() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("branding.title"),
    url:
      "https://solana.com" +
      (locale === "en" ? "" : "/" + locale) +
      "/branding",
    inLanguage: locale,
    description: t("branding.description"),
    mainEntity: {
      "@type": "ItemList",
      name: "Official Solana brand assets",
      itemListElement: logos.map((logo, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ImageObject",
          name: logo.alt,
          contentUrl: "https://solana.com" + base + logo.file + ".svg",
          thumbnailUrl: "https://solana.com" + base + logo.file + ".png",
          creditText: "Solana Foundation",
          license: "https://solana.com/branding#permissions",
        },
      })),
    },
  };

  return (
    <main className="bg-[#09090F] font-brand text-white">
      <header className="border-b border-white/15 bg-[#14141D]">
        <div className="container grid gap-8 py-14 md:grid-cols-[minmax(0,1fr)_220px] md:items-center md:py-20">
          <div>
            <p className="mb-5 font-brand-mono text-sm uppercase tracking-[0.16em] text-solana-green">
              Solana Foundation
            </p>
            <h1 className="m-0 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              {t("branding.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#C9C9D4] md:text-xl">
              {t("branding.description")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#assets"
                className="inline-flex min-h-12 items-center rounded-full bg-solana-green px-6 font-brand-mono text-sm uppercase text-black transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solana-green"
              >
                {t("branding.assets.download-btn")}
              </a>
              <a href="#guidelines" className={outlineLink}>
                {t("branding.tags.first-tag")}
              </a>
            </div>
          </div>
          <div className="hidden aspect-square items-center justify-center rounded-[2rem] border border-white/10 bg-[#20202B] md:flex">
            <Image
              src={base + "solanaLogoMark.svg"}
              width={120}
              height={105}
              alt=""
              aria-hidden="true"
              priority
            />
          </div>
        </div>
      </header>

      <div className="container grid gap-12 py-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <nav
          aria-label={t("branding.tags.title")}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="mb-4 font-brand-mono text-xs uppercase tracking-[0.16em] text-[#AFAFBE]">
            {t("branding.tags.title")}
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 lg:block">
            <li className="lg:border-t lg:border-white/20">
              <a
                className="inline-block py-2 text-sm text-[#D5D5DF] hover:text-solana-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-solana-green lg:py-4"
                href="#assets"
              >
                {t("branding.tags.second-tag")}
              </a>
            </li>
            <li className="lg:border-t lg:border-white/20">
              <a
                className="inline-block py-2 text-sm text-[#D5D5DF] hover:text-solana-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-solana-green lg:py-4"
                href="#guidelines"
              >
                {t("branding.tags.first-tag")}
              </a>
            </li>
            <li className="lg:border-t lg:border-white/20">
              <a
                className="inline-block py-2 text-sm text-[#D5D5DF] hover:text-solana-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-solana-green lg:py-4"
                href="#permissions"
              >
                {t("branding.permissions.title")}
              </a>
            </li>
            <li className="lg:border-t lg:border-white/20">
              <a
                className="inline-block py-2 text-sm text-[#D5D5DF] hover:text-solana-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-solana-green lg:py-4"
                href="#press"
              >
                {t("branding.tags.third-tag")}
              </a>
            </li>
          </ul>
        </nav>

        <div className="min-w-0 space-y-24">
          <section
            id="assets"
            className="scroll-mt-28"
            aria-labelledby="assets-heading"
          >
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2
                  id="assets-heading"
                  className="m-0 text-3xl font-semibold tracking-tight md:text-4xl"
                >
                  {t("branding.assets.title")}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#C9C9D4]">
                  {t("branding.welcome.description")}
                </p>
              </div>
              <a
                href="https://drive.google.com/drive/u/1/folders/1Y882o7uxW4Bx2vL6MXI-IozbGTX3ztBk"
                target="_blank"
                rel="noopener noreferrer"
                className={textLink}
              >
                {t("branding.assets.download-btn")}
              </a>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {logos.map((logo) => (
                <article
                  key={logo.file}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#171721]"
                >
                  <div className="flex h-48 items-center justify-center border-b border-white/10 bg-[#242431] p-8">
                    <Image
                      src={base + logo.file + ".svg"}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      unoptimized
                      className="h-auto max-h-32 w-full max-w-[470px] object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:p-6">
                    <h3 className="m-0 text-xl font-medium text-white">
                      {t("branding.assets." + logo.key)}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <a
                        className={outlineLink}
                        href={base + logo.file + ".svg"}
                        download={logo.file + ".svg"}
                        aria-label={t("branding.assets." + logo.key) + " SVG"}
                      >
                        SVG
                      </a>
                      <a
                        className={outlineLink}
                        href={base + logo.file + ".png"}
                        download={logo.file + ".png"}
                        aria-label={t("branding.assets." + logo.key) + " PNG"}
                      >
                        PNG
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="guidelines"
            className="scroll-mt-28"
            aria-labelledby="guidelines-heading"
          >
            <h2
              id="guidelines-heading"
              className="m-0 text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {t("branding.tags.first-tag")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#C9C9D4]">
              {t.rich("branding.welcome.description-2", {
                guidelinesLink: (chunks) => (
                  <a
                    href="https://docs.google.com/document/d/1gOjdCVI2tp-hpCJciSNZAR93cxgw_gh2/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={textLink}
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <div className="mt-10 border-t border-white/20 pt-9">
              <h3 className="m-0 text-2xl font-medium">
                {t("branding.logo.sub-title")}
              </h3>
              <p className="mt-4 max-w-3xl leading-relaxed text-[#C9C9D4]">
                {t("branding.logo.description")}
              </p>
            </div>
            <div className="mt-12 border-t border-white/20 pt-9">
              <h3 className="m-0 text-2xl font-medium">
                {t("branding.clearspace.title")}
              </h3>
              <p className="mt-4 max-w-3xl leading-relaxed text-[#C9C9D4]">
                {t("branding.clearspace.description")}
              </p>
              <div className="mt-7 overflow-hidden rounded-xl border border-white/15 bg-black p-5 sm:p-10">
                <Image
                  src={base + "spacing.png"}
                  alt="Minimum clear space around the Solana logomark and wordmark"
                  width={4680}
                  height={4272}
                  unoptimized
                  loading="eager"
                  className="mx-auto h-auto w-full max-w-2xl"
                />
              </div>
              <a
                href={base + "spacing.png"}
                target="_blank"
                rel="noopener noreferrer"
                className={"mt-4 inline-block text-sm " + textLink}
              >
                {t("branding.clearspace.view-full-size")}
              </a>
            </div>
            <div className="mt-12 border-t border-white/20 pt-9">
              <h3 className="m-0 text-2xl font-medium">
                {t("branding.banned.title")}
              </h3>
              <p className="mt-4 text-[#C9C9D4]">
                {t("branding.banned.description")}
              </p>
              <ul className="mt-7 grid list-none gap-4 p-0 sm:grid-cols-2">
                {banned.map((example) => (
                  <li
                    key={example.file}
                    className="overflow-hidden rounded-xl border border-white/15 bg-[#171721]"
                  >
                    <figure className="m-0">
                      <div
                        className={
                          "flex h-36 items-center justify-center p-5 " +
                          example.bg
                        }
                      >
                        <Image
                          src={base + example.file}
                          alt=""
                          width={240}
                          height={110}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <figcaption className="p-4 text-sm text-[#E1E1E8]">
                        {t("branding.banned." + example.key)}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 border-t border-white/20 pt-9">
              <h3 className="m-0 text-2xl font-medium">
                {t("branding.colors.title")}
              </h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-white/15 bg-[#171721]">
                  <div className="h-32 bg-[#9945FF]" />
                  <div className="flex justify-between gap-3 p-4 text-sm">
                    <span>{t("branding.colors.purple")}</span>
                    <code>#9945FF</code>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/15 bg-[#171721]">
                  <div className="h-32 bg-[#14F195]" />
                  <div className="flex justify-between gap-3 p-4 text-sm">
                    <span>{t("branding.colors.green")}</span>
                    <code>#14F195</code>
                  </div>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-[#171721]">
                <Image
                  src={base + "solanaGradient.jpg"}
                  alt="Official Solana purple to green gradient"
                  width={1360}
                  height={472}
                  className="h-auto w-full"
                />
                <div className="flex items-center justify-between gap-4 p-4 text-sm">
                  <span>{t("branding.colors.gradient")}</span>
                  <a
                    href={base + "solanaGradient.jpg"}
                    download="solanaGradient.jpg"
                    className={textLink}
                  >
                    JPG
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section
            id="permissions"
            className="scroll-mt-28 border-t border-white/20 pt-9"
            aria-labelledby="permissions-heading"
          >
            <h2
              id="permissions-heading"
              className="m-0 text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {t("branding.permissions.title")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#C9C9D4]">
              {t("branding.permissions.intro")}
            </p>
            <dl className="mt-7 border-t border-white/20">
              <div className="grid gap-2 border-b border-white/20 py-5 md:grid-cols-[150px_1fr] md:gap-6">
                <dt className="text-lg font-medium text-white">
                  {t("branding.permissions.ownership-title")}
                </dt>
                <dd className="m-0 text-base leading-relaxed text-[#C9C9D4]">
                  {t("branding.permissions.ownership")}
                </dd>
              </div>
              <div className="grid gap-2 border-b border-white/20 py-5 md:grid-cols-[150px_1fr] md:gap-6">
                <dt className="text-lg font-medium text-white">
                  {t("branding.permissions.accuracy-title")}
                </dt>
                <dd className="m-0 text-base leading-relaxed text-[#C9C9D4]">
                  {t("branding.permissions.accuracy")}
                </dd>
              </div>
              <div className="grid gap-2 border-b border-white/20 py-5 md:grid-cols-[150px_1fr] md:gap-6">
                <dt className="text-lg font-medium text-white">
                  {t("branding.permissions.artwork-title")}
                </dt>
                <dd className="m-0 text-base leading-relaxed text-[#C9C9D4]">
                  {t("branding.permissions.artwork")}
                </dd>
              </div>
              <div className="grid gap-2 border-b border-white/20 py-5 md:grid-cols-[150px_1fr] md:gap-6">
                <dt className="text-lg font-medium text-white">
                  {t("branding.permissions.commercial-title")}
                </dt>
                <dd className="m-0 text-base leading-relaxed text-[#C9C9D4]">
                  {t("branding.permissions.commercial")}
                </dd>
              </div>
            </dl>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#C9C9D4]">
              {t("branding.permissions.request")}{" "}
              <a
                href="mailto:operations@solana.foundation"
                className={textLink}
              >
                operations@solana.foundation
              </a>
              .{" "}
              <a
                href="https://docs.google.com/document/d/1gOjdCVI2tp-hpCJciSNZAR93cxgw_gh2/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className={textLink}
              >
                {t("branding.permissions.full-guidelines")}
              </a>
              .
            </p>
          </section>

          <section
            id="press"
            className="scroll-mt-28 border-t border-white/20 pt-9"
            aria-labelledby="press-heading"
          >
            <h2
              id="press-heading"
              className="m-0 text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {t("branding.press.title")}
            </h2>
            <p className="mt-4 text-[#C9C9D4]">
              {t("branding.press.description")}{" "}
              <a href="mailto:press@solana.org" className={textLink}>
                press@solana.org
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
