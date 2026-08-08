"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Globe from "./assets/icons/globe.inline.svg";
import ChevronGrabberVertical from "./assets/icons/chevron-grabber-vertical.inline.svg";
import { languages } from "@workspace/i18n/config";
import { Link, usePathname } from "@workspace/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "./classnames";

interface LanguageSelectorProps {
  className?: string;
  displayLanguageName?: boolean;
  ariaLabel?: string;
}

const LanguageSelector = ({
  className = "",
  displayLanguageName = false,
  ariaLabel,
}: LanguageSelectorProps) => {
  const currentLocale = useLocale();
  const asPath = usePathname();
  const currentLanguage =
    languages[currentLocale as keyof typeof languages] ?? currentLocale;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "p-0 border-0 inline-flex items-center",
            "h-9 text-[#848895] text-base",
            "hover:text-white",
            "transition-colors duration-200",
            className,
          )}
          type="button"
          aria-label={
            ariaLabel ? `${ariaLabel}: ${currentLanguage}` : undefined
          }
        >
          <Globe height="20" />
          <span
            className={cn(
              "mx-1 align-middle text-base font-normal",
              !displayLanguageName && "uppercase",
            )}
          >
            {displayLanguageName ? currentLanguage : currentLocale}
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
          className="language-selector-scroll z-[100] max-h-[50dvh] overflow-y-auto bg-[#111214] text-[#848895] p-[12px] rounded !border border-white/10 shadow-lg light:bg-white light:text-[#121212] light:border-black/10"
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
                aria-current={language === currentLocale ? "true" : undefined}
                className="block min-h-11 rounded px-2 py-2.5 text-base !text-[#848895] !no-underline outline-none hover:bg-[#151118] hover:!text-white focus:bg-[#151118] aria-current:bg-white/[0.08] aria-current:!text-white light:!text-[#121212] light:hover:bg-neutral-100 light:aria-current:bg-neutral-100"
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
