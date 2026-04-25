import FAQAccordionList from "@/components/FAQAccordionList";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { faqPageSections } from "@/content/faq-page";

function FAQHero() {
  return (
    <section className="bg-black px-5 md:px-8">
      <div className="flex w-full flex-col items-center justify-center gap-m pb-3 pt-[148px] text-center text-white md:pt-[180px]">
        <p className="font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] md:text-[16px]">
          Breakpoint 2026
        </p>
        <h1 className="font-sans text-[56px] font-normal leading-[0.98] tracking-[-0.06em] md:text-[80px]">
          FAQs
        </h1>
      </div>
    </section>
  );
}

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
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#faq-content"
        className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
      >
        Skip to content
      </a>

      <Navigation
        ctaAlwaysVisible
        ctaHref="/registration"
        ctaLabel="Register"
        showMenuButton
      />

      <div id="faq-content">
        <FAQHero />
        <FAQSubnav />
        <FAQAccordionList sections={faqPageSections} />
        <Footer accentClassName="bg-green" accentTextClassName="text-green" />
      </div>
    </main>
  );
}
