import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { breakpointHref } from "@/lib/links";
import { HERE_FOR_PATH } from "./constants";
import { hereForType } from "./typography";

/** Small "back to the map" link for the top of here-for subpages. */
export default function BackToMap() {
  const t = useTranslations("breakpoint.hereFor");
  return (
    <Link
      href={breakpointHref(HERE_FOR_PATH)}
      className={`w-fit ${hereForType.caption} text-text-secondary transition-colors hover:text-white`}
    >
      ← {t("nav.back")}
    </Link>
  );
}
