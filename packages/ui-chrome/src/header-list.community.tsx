import { useTranslations } from "next-intl";
import { Link } from "@workspace/i18n/routing";
import { usePathname } from "@workspace/i18n/use-router";
import classNames from "classnames";
import BreakpointLogo from "./assets/nav/community/breakpoint-logo.inline.svg";
import InvolvedSVG from "./assets/nav/community/involved.inline.svg";

export const HeaderListCommunity = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const communityInvolvedItems = t.raw("nav.community.involved.items");

  return (
    <div className="xl:flex">
      <div className="w-full xl:w-max">
        <div className="uppercase py-2 flex items-center !text-[#848895] text-xs">
          <InvolvedSVG className="me-3" />
          {t("nav.community.involved.title")}
        </div>
        <div>
          <Link
            href="/news"
            className={classNames(
              "block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm",
              {
                "!border-white/10 bg-[#151118]":
                  pathname === "/news" || pathname.startsWith("/news/"),
              },
            )}
          >
            <strong className="block !text-white text-sm">
              {communityInvolvedItems[0].title}
            </strong>
            {communityInvolvedItems[0].description}
          </Link>
          <Link
            href="/podcasts"
            className={classNames(
              "block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm",
              {
                "!border-white/10 bg-[#151118]":
                  pathname === "/podcasts" || pathname.startsWith("/podcasts/"),
              },
            )}
          >
            <strong className="block !text-white text-sm">
              {communityInvolvedItems[1].title}
            </strong>
            {communityInvolvedItems[1].description}
          </Link>
          <Link
            href="/events"
            className={classNames(
              "block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm",
              {
                "!border-white/10 bg-[#151118]":
                  pathname === "/events" || pathname.startsWith("/events/"),
              },
            )}
          >
            <strong className="block !text-white text-sm">
              {communityInvolvedItems[2].title}
            </strong>
            {communityInvolvedItems[2].description}
          </Link>
          <a
            href="https://www.solanacollective.com/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong className="block !text-white text-sm">
              {communityInvolvedItems[3].title}
            </strong>
            {communityInvolvedItems[3].description}
          </a>
          <Link
            href="/community"
            className={classNames(
              "block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm",
              {
                "!border-white/10 bg-[#151118]":
                  pathname === "/community" ||
                  pathname.startsWith("/community/"),
              },
            )}
          >
            <strong className="block !text-white text-sm">
              {communityInvolvedItems[4].title}
            </strong>
            {communityInvolvedItems[4].description}
          </Link>
          <a
            href="https://www.solanapolicyinstitute.org/"
            className="block !border !border-transparent rounded-lg px-2 py-1.5 my-1 -mx-2 hover:!border-white/10 hover:bg-[#151118] !text-[#ababbc] hover:!text-white transition-colors !no-underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong className="block !text-white text-sm">
              {communityInvolvedItems[5].title}
            </strong>
            {communityInvolvedItems[5].description}
          </a>
        </div>
      </div>

      <div className="bg-white/10 w-px h-auto my-[-26px] mx-[40px] hidden xl:block"></div>

      <div className="w-full xl:w-max">
        <div className="uppercase py-2 text-xs">
          {t("nav.community.event.title")}
        </div>
        <div>
          <Link href="/breakpoint" className="!text-white !no-underline">
            <BreakpointLogo
              width={228}
              height={131}
              className="my-5 w-full md:w-auto"
            />

            <div className="!text-white" style={{ lineHeight: 1.2 }}>
              Dec. 11-13, 2025 - ABU DHABI
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
