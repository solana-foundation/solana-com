"use client";

import Dropdown from "react-bootstrap/Dropdown";
import Globe from "../../public/src/img/icons/Globe.inline.svg";
import { ChevronDown } from "react-feather";
import languages from "../../public/json/languages.json";
import { usePathname, useLocale } from "@/i18n/routing";

const Language = () => {
  const currentLocale = useLocale();
  const asPath = usePathname();

  return (
    <Dropdown align="end" style={{ marginTop: "-5px" }} drop="auto">
      <Dropdown.Toggle
        className="p-0 border-0"
        variant="none"
        suppressHydrationWarning={true}
      >
        <Globe height="20" />
        <span className="align-middle fw-normal mx-1 text-uppercase">
          {currentLocale}
        </span>
        <ChevronDown size="17" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="bg-light">
        {Object.keys(languages).map((language) => (
          <Dropdown.Item key={language} href={"/" + language + asPath}>
            {languages[language]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Language;
