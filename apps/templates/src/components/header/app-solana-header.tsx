"use client";

import { SearchModal } from "../search";
import { useSearchModal } from "../hooks/use-search-modal";
import { HeaderLogo, HeaderSearchButton, HeaderNavigation } from ".";
import type { HeaderNavigationLink } from ".";

export function AppSolanaHeader({ links }: { links: HeaderNavigationLink[] }) {
  const searchModal = useSearchModal();

  return (
    <>
      <header className="w-full max-w-4xl rounded-full md:px-6 py-3 mx-auto mt-5 bg-neutral-900/50 backdrop-blur-lg border border-purple-400/10">
        <div className="max-w-[1200] container mx-auto py-md px-6">
          <div className="flex justify-between items-center">
            <HeaderLogo />

            <div className="flex gap-3 md:gap-5">
              <div className="flex items-center gap-3 md:gap-6">
                <HeaderSearchButton onClick={searchModal.open} />
                <HeaderNavigation links={links} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <SearchModal open={searchModal.isOpen} onOpenChange={searchModal.close} />
    </>
  );
}
