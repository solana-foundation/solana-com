"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "@/hooks/useRouter";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const pathname = usePathname();
  const isThemePage =
    pathname.startsWith("/docs") ||
    pathname.startsWith("/developers/cookbook") ||
    pathname.startsWith("/developers/guides") ||
    pathname.startsWith("/developers/courses");
  const [theme, setTheme] = useState("dark"); // Initial theme state; will be updated by useEffect.

  useEffect(() => {
    if (isThemePage) {
      // Function to update the theme based on the passed theme name
      const updateTheme = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.classList.remove(
          "dark",
          "tw-dark",
          "light",
          "tw-light",
        );
        document.documentElement.classList.add(newTheme, `tw-${newTheme}`);
        localStorage.setItem("theme", newTheme);
      };

      // Check if user has a theme preference in localStorage
      const localTheme = localStorage.getItem("theme");
      if (localTheme) {
        updateTheme(localTheme);
      } else {
        // Use system color scheme if no local preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        const systemTheme = prefersDark ? "dark" : "light";
        updateTheme(systemTheme);
      }

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const mediaQueryListener = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        updateTheme(newTheme);
      };
      mediaQuery.addListener(mediaQueryListener);

      // Cleanup listener on component unmount
      return () => mediaQuery.removeListener(mediaQueryListener);
    } else {
      setTheme("dark");
      document.documentElement.classList.remove(
        "light",
        "tw-light",
        "dark",
        "tw-dark",
      );
      document.documentElement.classList.add("dark", "tw-dark");
    }
  }, [pathname, isThemePage]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.remove(
      "dark",
      "tw-dark",
      "light",
      "tw-light",
    );
    document.documentElement.classList.add(newTheme, `tw-${newTheme}`);
    setTheme(newTheme);
    if (isThemePage) {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isThemePage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
