import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@workspace/i18n/use-router";
import { useTranslations } from "next-intl";
import SolanaLogo from "./logos-solana/logotype.inline.svg";
import Moon from "./icons/Moon.inline.svg";
import Sun from "./icons/Sun.inline.svg";
import { Link } from "@workspace/i18n/link";
import { InkeepSearchBar } from "./inkeep-searchbar";

function useIsThemePage() {
  const pathname = usePathname();
  return pathname
    ? pathname.startsWith("/docs") ||
        pathname.startsWith("/developers/cookbook") ||
        pathname.startsWith("/developers/guides") ||
        pathname.startsWith("/developers/courses")
    : false;
}

function useTheme() {
  const isThemePage = useIsThemePage();
  return {
    isThemePage,
    theme: "dark",
    toggleTheme: () => true,
  };
}
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <button
      className="ml-[15px] flex border-0 transition-transform duration-300 hover:scale-110 hover:[transform:rotate(15deg)] [&_svg]:hover:fill-[var(--body-text)]"
      onClick={toggleTheme}
      aria-label={t("commands.toggle")}
    >
      {theme === "light" && <Moon />}
      {theme === "dark" && <Sun />}
    </button>
  );
}

function HeaderList() {
  // TODO: Re-implement header list for tw4
  return null;
}

export function Header({
  className = "",
  containerClassName = "",
}: {
  className: string;
  containerClassName: string;
}) {
  const router = useRouter();
  const { theme, isThemePage } = useTheme();
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (isThemePage) {
        navbar.classList.remove("navbar-light", "navbar-dark");
        navbar.classList.add("navbar-" + theme);
      } else {
        navbar.classList.add("navbar-dark");
      }
    }
  }, [t, theme, isThemePage]);

  useEffect(() => {
    setExpanded(false);
  }, [router.asPath]);

  return (
    <>
      <header className={`z-20 position-sticky sticky-top ${className}`}>
        <nav
          id="navbar"
          className="navbar navbar-expand-lg"
          aria-label="Primary"
        >
          <div className={`container-xl ${containerClassName}`}>
            <Link to="/" className="d-flex" aria-label="Solana">
              <SolanaLogo
                style={{ color: "var(--body-text)" }}
                width={149}
                height={22}
              />
            </Link>

            <div className="d-flex align-items-center">
              <button
                className="navbar-toggler"
                aria-controls="navbarCollapse"
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((e) => !e)}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
              <div
                id="navbarCollapse"
                className={`collapse navbar-collapse ${expanded ? "show" : ""}`}
              >
                <HeaderList />
              </div>
              <InkeepSearchBar />
              {isThemePage && <ThemeToggle />}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
