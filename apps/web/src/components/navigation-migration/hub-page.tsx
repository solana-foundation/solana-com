import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui";

export interface HubLink {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface HubSection {
  title: string;
  description?: string;
  links: HubLink[];
}

export interface HubFeature {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface HubPageConfig {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: HubLink;
  secondaryCta?: HubLink;
  feature?: HubFeature;
  sections: HubSection[];
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function LinkAnchor({
  link,
  className,
  children,
}: {
  link: HubLink;
  className?: string;
  children: React.ReactNode;
}) {
  const external = link.external ?? isExternalHref(link.href);

  return (
    <a
      href={link.href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

export function NavigationHubPage({ config }: { config: HubPageConfig }) {
  return (
    <main className="min-h-screen bg-[#050509] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 pb-16 pt-32 md:px-8 md:pb-20 xl:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.55fr)] xl:px-[72px] xl:pb-24 xl:pt-40">
          <div className="max-w-[760px]">
            <p className="mb-5 font-brand-mono text-xs font-medium uppercase tracking-[1px] text-[#14f195]">
              {config.eyebrow}
            </p>
            <h1 className="max-w-[860px] text-[48px] font-medium leading-[0.96] tracking-normal md:text-[72px] xl:text-[92px]">
              {config.title}
            </h1>
            <p className="mt-6 max-w-[640px] text-lg leading-[1.55] text-[#c9c9d4] md:text-xl">
              {config.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 rounded-full bg-white px-5 text-base font-medium text-black hover:bg-[#e8e8ef]"
              >
                <LinkAnchor link={config.primaryCta}>
                  {config.primaryCta.title}
                  <ArrowRight className="size-4" />
                </LinkAnchor>
              </Button>
              {config.secondaryCta && (
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-white/20 bg-white/5 px-5 text-base font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <LinkAnchor link={config.secondaryCta}>
                    {config.secondaryCta.title}
                    {(config.secondaryCta.external ??
                      isExternalHref(config.secondaryCta.href)) && (
                      <ExternalLink className="size-4" />
                    )}
                  </LinkAnchor>
                </Button>
              )}
            </div>
          </div>

          {config.feature && (
            <aside className="self-end rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="font-brand-mono text-xs font-medium uppercase tracking-[1px] text-[#9945ff]">
                {config.feature.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-medium leading-tight">
                {config.feature.title}
              </h2>
              <p className="mt-3 text-sm leading-[1.55] text-[#c9c9d4]">
                {config.feature.description}
              </p>
              <a
                href={config.feature.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {config.feature.cta}
                <ArrowRight className="size-4" />
              </a>
            </aside>
          )}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-5 px-5 py-14 md:grid-cols-2 md:px-8 xl:grid-cols-3 xl:px-[72px] xl:py-20">
        {config.sections.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
          >
            <h2 className="text-2xl font-medium leading-tight">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-3 text-sm leading-[1.55] text-[#a9a9b7]">
                {section.description}
              </p>
            )}
            <div className="mt-5 divide-y divide-white/[0.06]">
              {section.links.map((link) => {
                const external = link.external ?? isExternalHref(link.href);

                return (
                  <a
                    key={`${section.title}-${link.href}`}
                    href={link.href}
                    className="group flex items-start justify-between gap-4 py-4 text-white no-underline"
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    <span>
                      <span className="block font-medium leading-tight">
                        {link.title}
                      </span>
                      {link.description && (
                        <span className="mt-1 block text-sm leading-[1.45] text-[#a9a9b7]">
                          {link.description}
                        </span>
                      )}
                    </span>
                    {external ? (
                      <ExternalLink className="mt-0.5 size-4 shrink-0 text-white/50 transition-colors group-hover:text-white" />
                    ) : (
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
