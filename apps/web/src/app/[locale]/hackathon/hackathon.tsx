"use client";

import { useRef, useCallback } from "react";
import HackathonHeroSection from "@/components/hackathon/sections/HackathonHeroSection/HackathonHeroSection";
import HackathonOverviewSection from "@/components/hackathon/sections/HackathonOverviewSection/HackathonOverviewSection";
import HackathonPreviousSponsorsSection from "@/components/hackathon/sections/HackathonPreviousSponsorsSection/HackathonPreviousSponsorsSection";
import HackathonPreviousWinnersSection from "@/components/hackathon/sections/HackathonPreviousWinnersSection/HackathonPreviousWinnersSection";
import HackathonPreviousHackathonsSection from "@/components/hackathon/sections/HackathonPreviousHackathonsSection/HackathonPreviousHackathonsSection";

export function HackathonPage() {
  const newsletterSignUpRef = useRef<HTMLInputElement>(null);

  const focusOnNewsletterSignUp = useCallback(() => {
    window.scrollTo(0, 0);

    if (newsletterSignUpRef.current) {
      newsletterSignUpRef.current.focus();
    }
  }, []);

  return (
    <>
      <HackathonHeroSection newsletterInputRef={newsletterSignUpRef} />
      <HackathonPreviousWinnersSection />
      <HackathonPreviousSponsorsSection />
      <HackathonPreviousHackathonsSection />
      <HackathonOverviewSection onGetNotified={focusOnNewsletterSignUp} />
    </>
  );
}
