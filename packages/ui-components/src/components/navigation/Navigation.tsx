import React, { useState, useEffect } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { NavigationProps } from "./types";
import { NavigationDropdown } from "./NavigationDropdown";
import { NavigationMobile } from "./NavigationMobile";
import classNames from "classnames";

export const Navigation: React.FC<NavigationProps> = ({
  items,
  logo,
  logoHref = "/",
  searchBar,
  themeToggle,
  currentPath = "",
  className,
  containerClassName,
  darkMode = true,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  return (
    <header className={classNames("sticky top-0 z-50", className)}>
      <nav
        className={classNames(
          "py-2 backdrop-blur-xl transition-colors duration-300",
          darkMode ? "bg-nav-bg-dark" : "bg-nav-bg-light",
        )}
      >
        <div
          className={classNames("container mx-auto px-4", containerClassName)}
        >
          <div className="flex items-center justify-between h-[59px]">
            {/* Logo */}
            <a
              href={logoHref}
              className="flex items-center h-full"
              aria-label="Home"
            >
              {logo || (
                <span
                  className={classNames(
                    "text-2xl font-bold",
                    darkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Logo
                </span>
              )}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center h-full">
              <NavigationMenu.Root className="relative h-full flex items-center">
                <NavigationMenu.List className="flex items-center h-full space-x-2 list-none m-0 p-0">
                  {items.map((item, index) => (
                    <NavigationMenu.Item
                      key={index}
                      className="relative list-none h-full flex items-center"
                    >
                      {item.children ? (
                        <NavigationDropdown
                          item={item}
                          currentPath={currentPath}
                          darkMode={darkMode}
                        />
                      ) : (
                        <NavigationMenu.Link
                          href={item.href}
                          className={classNames(
                            "flex items-center h-full px-2 text-[17px] font-light text-nav-text hover:text-nav-text-hover transition-colors",
                            {
                              "text-nav-text-hover":
                                typeof item.isActive === "function"
                                  ? item.isActive(currentPath)
                                  : item.isActive || currentPath === item.href,
                            },
                          )}
                        >
                          {item.label}
                        </NavigationMenu.Link>
                      )}
                    </NavigationMenu.Item>
                  ))}
                </NavigationMenu.List>
              </NavigationMenu.Root>

              {/* Desktop Right Side */}
              <div className="flex items-center h-full ml-4 space-x-4">
                {searchBar}
                {themeToggle}
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center lg:hidden">
              {searchBar && <div className="mr-2">{searchBar}</div>}
              {themeToggle && <div className="mr-2">{themeToggle}</div>}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solana-purple"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between">
                  <span
                    className={classNames(
                      "w-full h-0.5 bg-current transform transition-all duration-300",
                      darkMode ? "bg-white" : "bg-gray-900",
                      mobileMenuOpen && "rotate-45 translate-y-2",
                    )}
                  />
                  <span
                    className={classNames(
                      "w-full h-0.5 bg-current transition-opacity duration-300",
                      darkMode ? "bg-white" : "bg-gray-900",
                      mobileMenuOpen && "opacity-0",
                    )}
                  />
                  <span
                    className={classNames(
                      "w-full h-0.5 bg-current transform transition-all duration-300",
                      darkMode ? "bg-white" : "bg-gray-900",
                      mobileMenuOpen && "-rotate-45 -translate-y-2",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <NavigationMobile
        items={items}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={currentPath}
        darkMode={darkMode}
      />
    </header>
  );
};
