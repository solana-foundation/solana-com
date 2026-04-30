import Button from "@/components/Button";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import { GENERAL_ADMISSION_HREF, SIDE_EVENTS_HREF } from "@/content/links";

type ComingSoonPageProps = {
  description: string;
  title: string;
};

const releaseLinks = [
  {
    href: "/travel",
    label: "Plan travel",
  },
  {
    href: "/sponsors",
    label: "Sponsor",
  },
  {
    href: SIDE_EVENTS_HREF,
    label: "Side events",
  },
] as const;

export default function ComingSoonPage({
  description,
  title,
}: ComingSoonPageProps) {
  return (
    <PageShell
      contentId={`breakpoint-${title.toLowerCase()}-coming-soon-content`}
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: "Get tickets",
        showMenuButton: true,
      }}
    >
      <SubpageHero
        image={false}
        eyebrow="Coming soon"
        title={title}
        cta={{
          href: GENERAL_ADMISSION_HREF,
          label: "Get tickets",
        }}
      >
        <p className="type-p-large max-w-[720px] text-white md:text-center">
          {description}
        </p>
      </SubpageHero>

      <section className="bg-black px-xs pt-xl md:px-m md:pt-2xl">
        <div className="mx-auto grid max-w-[1376px] gap-s md:grid-cols-3">
          {releaseLinks.map((link) => (
            <div
              key={link.href}
              className="flex min-h-[220px] flex-col justify-between border border-neutral-700 bg-white/[0.03] p-s"
            >
              <p className="type-eyebrow text-white opacity-70">Live now</p>
              <Button
                arrow
                href={link.href}
                label={link.label}
                variant="inline"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </PageShell>
  );
}
