"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Globe from "./assets/icons/globe.inline.svg";
import ChevronGrabberVertical from "./assets/icons/chevron-grabber-vertical.inline.svg";
import { languages } from "@workspace/i18n/config";
import { Link, usePathname } from "@workspace/i18n/routing";
import { useLocale } from "next-intl";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

const LanguageSelector = ({ className = "" }: { className?: string }) => {
  const currentLocale = useLocale();
  const asPath = usePathname();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "p-0 border-0 inline-flex items-center",
            "text-[#848895] text-base light:text-[#7f8391]",
            "hover:text-white light:hover:text-gray-900",
            "transition-colors duration-200",
            className,
          )}
          type="button"
        >
          <Globe height="20" />
          <span className="align-middle font-normal mx-1 uppercase text-base">
            {currentLocale}
          </span>
          <ChevronGrabberVertical width="20" height="20" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="top"
          sideOffset={8}
          avoidCollisions
          collisionPadding={16}
          className="language-selector-scroll z-[100] max-h-[50vh] overflow-y-auto bg-[#111214] text-[#848895] p-[12px] rounded !border border-white/10 shadow-lg light:bg-white light:text-[#121212] light:border-black/10"
        >
          <style>{`
            .language-selector-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(115, 115, 115, 0.5) transparent;
            }
            .language-selector-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .language-selector-scroll::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 4px;
            }
            .language-selector-scroll::-webkit-scrollbar-thumb {
              background: rgba(115, 115, 115, 0.5);
              border-radius: 4px;
              border: 1px solid rgba(64, 64, 64, 0.3);
            }
            .language-selector-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(115, 115, 115, 0.7);
            }
            .language-selector-scroll::-webkit-scrollbar-thumb:active {
              background: rgba(115, 115, 115, 0.9);
            }
          `}</style>
          {Object.keys(languages).map((language) => (
            <DropdownMenu.Item asChild key={language}>
              <Link
                href={asPath || "/"}
                locale={language}
                className="block px-2 py-1.5 rounded !no-underline text-base !text-[#848895] hover:!text-white hover:bg-[#151118] focus:bg-[#151118] outline-none light:!text-[#121212] light:hover:bg-neutral-100"
              >
                {languages[language as keyof typeof languages]}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { LanguageSelector };
