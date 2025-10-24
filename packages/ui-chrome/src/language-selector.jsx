"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Globe from "./assets/globe.inline.svg";
import ChevronGrabberVertical from "./assets/chevron-grabber-vertical.inline.svg";
import { languages } from "@workspace/i18n/config";
import { usePathname } from "@workspace/i18n/routing";
import { useLocale } from "next-intl";

const LanguageSelector = () => {
  const currentLocale = useLocale();
  const asPath = usePathname();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-0 border-0 hover:!text-[var(--body-text)] dark:hover:!text-white transition-colors inline-flex items-center"
          type="button"
          suppressHydrationWarning={true}
        >
          <Globe height="20" />
          <span className="align-middle fw-normal mx-1 text-uppercase text-base">
            {currentLocale}
          </span>
          <ChevronGrabberVertical width="20" height="20" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        side="bottom"
        sideOffset={8}
        className="max-h-[50vh] overflow-y-auto bg-[#111214] text-[#848895] p-[12px] rounded !border border-white/10 shadow-lg light:bg-white light:text-[var(--body-text)] light:border-black/10"
      >
        {Object.keys(languages).map((language) => (
          <DropdownMenu.Item asChild key={language}>
            <a
              href={"/" + language + asPath}
              className="block px-2 py-1.5 rounded !no-underline text-base !text-[#848895] hover:!text-white hover:bg-[#151118] focus:bg-[#151118] outline-none light:!text-[var(--body-text)] light:hover:bg-neutral-100"
            >
              {languages[language]}
            </a>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export { LanguageSelector };
