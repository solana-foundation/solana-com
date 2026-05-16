"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SidebarCollapseTrigger } from "fumadocs-ui/layouts/docs/sidebar";
import {
  DOCS_SIDEBAR_TOGGLE_SLOT_ID,
  DocsSidebarToggleIcon,
} from "@solana-com/ui-chrome";

export function DocsSidebarTogglePortal({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      setContainer(null);
      return;
    }

    setContainer(document.getElementById(DOCS_SIDEBAR_TOGGLE_SLOT_ID));
  }, [enabled]);

  useLayoutEffect(() => {
    if (!enabled || !container) {
      return;
    }

    container.setAttribute("data-toggle-mounted", "true");
    return () => {
      container.removeAttribute("data-toggle-mounted");
    };
  }, [enabled, container]);

  if (!enabled || !container) {
    return null;
  }

  return createPortal(
    <SidebarCollapseTrigger
      aria-label="Toggle sidebar"
      className="hidden md:inline-flex h-8 w-8 text-inherit [&_svg]:size-4"
    >
      <DocsSidebarToggleIcon className="!w-4 !h-4" />
    </SidebarCollapseTrigger>,
    container,
  );
}
