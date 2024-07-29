import languages from "../../public/json/languages.json";
import { config } from "src/config";

const cleanPath = (pathString) => {
  try {
    const url = new URL(pathString, config.siteUrl);
    // Clear all search parameters
    url.searchParams.forEach((value, name) => {
      url.searchParams.delete(name);
    });

    // Return the cleaned Pathname
    let cleanedPath = url.pathname.toString();
    // Remove trailing slash if it exists
    if (cleanedPath.endsWith("/")) {
      cleanedPath = cleanedPath.slice(0, -1);
    }
    return cleanedPath;
  } catch (error) {
    console.error("Error cleaning Path:", error);
    return urlString; // Return the original path in case of any error
  }
};

const MetaLinks = ({ localeNoEnDefault, asPathNoRedirect }) => {
  const cleanedAsPathNoRedirect = cleanPath(asPathNoRedirect);
  return (
    <>
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      {/* preferred canonical page */}
      <link
        rel="canonical"
        href={`${config.siteUrl}${localeNoEnDefault}${cleanedAsPathNoRedirect}`}
      ></link>
      {/* hreflang localized variations of the same content */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${config.siteUrl}${cleanedAsPathNoRedirect}`}
      ></link>
      {Object.keys(languages).map((language, k) => (
        <link
          key={k}
          rel="alternate"
          hrefLang={language}
          href={`${config.siteUrl}${
            language === "en" ? "" : "/" + language
          }${cleanedAsPathNoRedirect}`}
        />
      ))}
    </>
  );
};

export default MetaLinks;
