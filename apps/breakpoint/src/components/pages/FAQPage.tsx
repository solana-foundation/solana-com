import FAQAccordionList from "@/components/FAQAccordionList";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import { faqPageSections } from "@/content/faq-page";

function FAQSubnav() {
  return (
    <nav
      aria-label="FAQ categories"
      className="border-b border-neutral-700 bg-black px-5 pb-s pt-m md:px-8"
    >
      <div className="scrollbar-hidden mx-auto flex max-w-full gap-3 overflow-x-auto scroll-px-5 md:justify-center">
        {faqPageSections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex shrink-0 items-center justify-center border border-neutral-700 px-3 py-3 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {section.title}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function FAQPage() {
  return (
    <PageShell
      contentId="faq-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: "Register",
        showMenuButton: true,
      }}
    >
      <SubpageHero image={false} title="FAQs" />
      <FAQSubnav />
      <FAQAccordionList sections={faqPageSections} />
      <Footer accentClassName="bg-green" accentTextClassName="text-green" />
    </PageShell>
  );
}
