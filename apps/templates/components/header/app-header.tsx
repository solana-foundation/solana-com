"use client";

import Link from "next/link";

export function AppHeader() {
  return (
    <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <Link
            className="text-xl hover:text-neutral-500 dark:hover:text-white"
            href="/templates"
          >
            <span>Templates</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div />
        </div>
      </div>
    </header>
  );
}
