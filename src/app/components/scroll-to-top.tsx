"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ScrollToTop() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeVisible = window.scrollY > window.innerHeight;
      setIsVisible(shouldBeVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground/80"
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} />
      <span>{t("shared.general.scroll-to-top")}</span>
    </button>
  );
}
