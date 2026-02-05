"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SidebarCollapseTrigger } from "fumadocs-ui/layouts/docs/sidebar";
import { useSidebar } from "fumadocs-ui/provider";

const STORAGE_KEY = "docs.sidebar.collapsed";
const SLOT_ID = "docs-sidebar-toggle-slot";

export function DocsSidebarTogglePortal({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  const { collapsed, setCollapsed } = useSidebar();
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setContainer(document.getElementById(SLOT_ID));
  }, [enabled]);

  useEffect(() => {
    if (!enabled || hydratedRef.current) {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
    hydratedRef.current = true;
  }, [enabled, setCollapsed]);

  useEffect(() => {
    if (!enabled || !hydratedRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [enabled, collapsed]);

  if (!enabled || !container) {
    return null;
  }

  return createPortal(
    <SidebarCollapseTrigger
      aria-label="Toggle sidebar"
      className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md tw-border border-transparent text-[#848895] hover:!text-white hover:border-[rgba(255,255,255,0.2)] light:text-[#7f8391] light:hover:!text-gray-900 light:hover:border-[rgba(0,0,0,0.2)]"
    />,
    container,
  );
}
