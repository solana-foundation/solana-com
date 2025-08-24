import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NavigationItem } from "./types";
import classNames from "classnames";
import Link from "next/link";

interface NavigationDropdownProps {
  item: NavigationItem;
  currentPath: string;
  darkMode: boolean;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
  item,
  currentPath,
  darkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    typeof item.isActive === "function"
      ? item.isActive(currentPath)
      : item.isActive || currentPath === item.href;

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={classNames(
            "inline-flex items-center justify-center h-full space-x-1 px-2 text-[17px] font-light text-nav-text hover:text-nav-text-hover transition-colors relative",
            isActive && "text-nav-text-hover",
          )}
          style={
            isActive && item.color
              ? ({ "--color-active": item.color } as React.CSSProperties)
              : undefined
          }
        >
          <span>{item.label}</span>
          <svg
            className={classNames(
              "w-4 h-4 transition-transform duration-300",
              isOpen && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span
            className={classNames(
              "absolute -bottom-2 left-0 right-0 h-[2px] transition-opacity duration-200",
              (isOpen || isActive) && item.color ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundColor: item.color || 'transparent' }}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={classNames(
            "rounded-xl backdrop-blur-xl z-[100]",
            "bg-black/90 shadow-[0_10px_10px_rgba(0,0,0,0.5)]",
            "[border:1px_solid_rgba(255,255,255,0.1)]",
            "motion-safe:animate-slide-down motion-reduce:animate-none",
          )}
          sideOffset={16}
          align="start"
          alignOffset={item.label === "Solutions" || item.label === "Network" || item.label === "Community" ? -30 : 0}
        >
          <div className="flex flex-col overflow-hidden">
            {/* Main row with first columns */}
            <div className="flex flex-col lg:flex-row p-6">
              {item.children?.slice(0, item.children.length > 2 ? 2 : undefined).map((section, sectionIndex) => {
                // Define width classes for different column widths
                const widthClasses = {
                  'auto': 'flex-1',           // Equal distribution (default)
                  'compact': 'flex-grow',      // ~30-35% when paired with wide
                  'normal': 'flex-grow-[3]',   // ~60% when paired with compact  
                  'wide': 'flex-grow-[2]'      // ~65-70% when paired with compact
                };
                
                return (
                  <React.Fragment key={sectionIndex}>
                    {sectionIndex > 0 && section.divider && (
                      <>
                        {/* Mobile horizontal divider */}
                        <div className="block lg:hidden w-full h-px bg-white/10 my-6" />
                        {/* Desktop vertical divider - as a flex item between columns */}
                        <div className="hidden lg:block w-px bg-white/10 mx-12 -my-6" />
                      </>
                    )}
                    <div className={widthClasses[section.columnWidth || 'auto']}>
                    {section.title && (
                      <div className="flex items-center mb-4 text-[13px] uppercase tracking-widest text-gray-400">
                        {section.icon && (
                          <span className="mr-2">{section.icon}</span>
                        )}
                        {section.title}
                      </div>
                    )}
                    <div className="space-y-0">
                      {section.items.map((link, linkIndex) => (
                        <DropdownMenu.Item key={linkIndex} asChild>
                          {link.isExternal ? (
                            <a
                              href={link.href}
                              className={classNames(
                                "block",
                                link.image ? "focus:outline-none" : "p-3 -mx-3 rounded-lg group",
                                !link.image && "transition-[background-color,box-shadow] duration-200",
                                !link.image && "hover:bg-white/5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
                                !link.image && "focus:outline-none focus:bg-white/5 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                                {
                                  "opacity-100": link.image || (typeof link.isActive === "function"
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href),
                                  "opacity-90": !link.image && !(typeof link.isActive ===
                                  "function"
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href),
                                },
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                            {link.image ? (
                              <div className="flex flex-col">
                                {link.image}
                                {link.description && (
                                  <div className="text-[14px] text-gray-300 leading-relaxed mt-2">
                                    {link.description}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <div className={classNames(
                                  "text-white text-base font-normal",
                                  link.description && "mb-1"
                                )}>
                                  {link.label}
                                </div>
                                {link.description && (
                                  <div className="text-[13px] text-gray-400 leading-relaxed transition-colors duration-200 group-hover:text-gray-300">
                                    {link.description}
                                  </div>
                                )}
                              </>
                            )}
                          </a>
                          ) : (
                            <Link
                              href={link.href}
                              className={classNames(
                                "block",
                                link.image ? "focus:outline-none" : "p-3 -mx-3 rounded-lg group",
                                !link.image && "transition-[background-color,box-shadow] duration-200",
                                !link.image && "hover:bg-white/5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
                                !link.image && "focus:outline-none focus:bg-white/5 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                                {
                                  "opacity-100": link.image || (typeof link.isActive === "function"
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href),
                                  "opacity-90": !link.image && !(typeof link.isActive ===
                                  "function"
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href),
                                },
                              )}
                            >
                            {link.image ? (
                              <div className="flex flex-col">
                                {link.image}
                                {link.description && (
                                  <div className="text-[14px] text-gray-300 leading-relaxed mt-2">
                                    {link.description}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                <div className={classNames(
                                  "text-white text-base font-normal",
                                  link.description && "mb-1"
                                )}>
                                  {link.label}
                                </div>
                                {link.description && (
                                  <div className="text-[13px] text-gray-400 leading-relaxed transition-colors duration-200 group-hover:text-gray-300">
                                    {link.description}
                                  </div>
                                )}
                              </>
                            )}
                          </Link>
                          )}
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
                );
              })}
            </div>
            
            {/* Bottom section for 3rd+ columns */}
            {item.children && item.children.length > 2 && (
              <div className="relative">
                <div className="absolute inset-x-0 bottom-0 top-0 bg-white/[0.03]" />
                <div className="relative px-6 py-4 border-t border-white/[0.05]">
                  {item.children.slice(2).map((section, sectionIndex) => (
                    <div key={sectionIndex + 2}>
                      {section.title && (
                        <div className="flex items-center mb-3 text-[13px] uppercase tracking-widest text-gray-400">
                          {section.icon && (
                            <span className="mr-2">{section.icon}</span>
                          )}
                          {section.title}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                      {section.items.map((link, linkIndex) => (
                        <DropdownMenu.Item key={linkIndex} asChild>
                          {link.isExternal ? (
                            <a
                              href={link.href}
                              className={classNames(
                                "block p-3 -m-3 rounded-lg",
                                "transition-[background-color,box-shadow] duration-200",
                                "hover:bg-white/5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
                                "focus:outline-none focus:bg-white/5 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                                {
                                  "opacity-100":
                                    typeof link.isActive === "function"
                                      ? link.isActive(currentPath)
                                      : link.isActive || currentPath === link.href,
                                  "opacity-90": !(typeof link.isActive ===
                                  "function"
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href),
                                },
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="text-white text-base font-normal">
                                {link.label}
                              </div>
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className={classNames(
                                "block p-3 -m-3 rounded-lg",
                                "transition-[background-color,box-shadow] duration-200",
                                "hover:bg-white/5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
                                "focus:outline-none focus:bg-white/5 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                                {
                                  "opacity-100":
                                    typeof link.isActive === "function"
                                      ? link.isActive(currentPath)
                                      : link.isActive || currentPath === link.href,
                                  "opacity-90": !(typeof link.isActive ===
                                  "function"
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href),
                                },
                              )}
                            >
                              <div className="text-white text-base font-normal">
                                {link.label}
                              </div>
                            </Link>
                          )}
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
