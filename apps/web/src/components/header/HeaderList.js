import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AngleUp from "../../../public/src/img/icons/Angle-up.inline.svg";
import AngleDown from "../../../public/src/img/icons/Angle-down.inline.svg";
import { useTranslations } from "next-intl";
import { useRouter } from "@@/src/hooks/useRouter";
import HeaderListBuild from "./HeaderListBuild";
import HeaderListSolutions from "./HeaderListSolutions";
import HeaderListNetwork from "./HeaderListNetwork";
import HeaderListCommunity from "./HeaderListCommunity";
import HeaderListLearn from "./HeaderListLearn";

const DownIcon = <AngleDown width={16} height={16} viewBox="0 0 24 24" />;
const UpIcon = <AngleUp width={16} height={16} viewBox="0 0 24 24" />;

const HeaderList = () => {
  const t = useTranslations();
  const { asPath } = useRouter();

  const [showNetwork, updateShowNetwork] = useState(false);
  const [showSolutions, updateShowSolutions] = useState(false);
  const [showDevelopers, updateShowDevelopers] = useState(false);
  const [showCommunity, updateShowCommunity] = useState(false);
  const [showLearn, updateShowLearn] = useState(false);

  useEffect(() => {
    // links from "developers" (app router) doesnt reload the page
    // so we need to close the dropdown when the route changes
    updateShowDevelopers(false);
    updateShowLearn(false);
  }, [asPath]);

  const isLearnActive =
    asPath.includes("/learn") ||
    asPath === "/environment" ||
    asPath.includes("/universities");
  const isSolutionsActive =
    asPath.includes("/solutions") ||
    asPath.includes("/wallets") ||
    asPath.includes("/ai");
  const isBuildActive =
    asPath.includes("/developers") ||
    asPath.includes("/docs") ||
    asPath === "/hackathon";
  const isNetworkActive =
    asPath === "/validators" || asPath === "/rpc" || asPath === "/solanaramp";
  const isCommunityActive =
    asPath === "/community" ||
    asPath.includes("/events") ||
    asPath === "/breakpoint" ||
    asPath === "/news";

  return (
    <ul className="navbar-nav">
      <Dropdown
        as="li"
        className={`nav-item`}
        onToggle={(isOpen) => {
          isOpen ? updateShowLearn(true) : updateShowLearn(false);
        }}
        show={showLearn}
        style={{ "--color-active": "#19fb9b" }}
      >
        <Dropdown.Toggle
          as="button"
          type="button"
          className={`nav-link nav-link--primary dropdown-toggle ${
            isLearnActive && "active"
          }`}
          suppressHydrationWarning={true}
        >
          {t("nav.learn.title")}
          {showLearn ? UpIcon : DownIcon}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <HeaderListLearn />
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        as="li"
        className={`nav-item`}
        onToggle={(isOpen) => {
          isOpen ? updateShowDevelopers(true) : updateShowDevelopers(false);
        }}
        show={showDevelopers}
        style={{ "--color-active": "#fed612" }}
      >
        <Dropdown.Toggle
          as="button"
          type="button"
          className={`nav-link nav-link--primary dropdown-toggle ${
            isBuildActive && "active"
          }`}
          suppressHydrationWarning={true}
        >
          {t("nav.developers.title")}
          {showDevelopers ? UpIcon : DownIcon}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <HeaderListBuild />
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        as="li"
        className={`nav-item`}
        onToggle={(isOpen) => {
          isOpen ? updateShowSolutions(true) : updateShowSolutions(false);
        }}
        style={{ "--color-active": "#FF5722" }}
      >
        <Dropdown.Toggle
          as="button"
          type="button"
          className={`nav-link nav-link--primary dropdown-toggle ${
            isSolutionsActive ? "active" : ""
          }`}
          suppressHydrationWarning={true}
        >
          {t("nav.solutions.title")}
          {showSolutions ? UpIcon : DownIcon}
        </Dropdown.Toggle>
        <Dropdown.Menu className="xl:overflow-y-auto xl:max-h-[90vh]">
          <HeaderListSolutions />
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        as="li"
        className={`nav-item`}
        onToggle={(isOpen) => {
          isOpen ? updateShowNetwork(true) : updateShowNetwork(false);
        }}
        style={{ "--color-active": "#9945ff" }}
      >
        <Dropdown.Toggle
          as="button"
          type="button"
          className={`nav-link nav-link--primary dropdown-toggle ${
            isNetworkActive && "active"
          }`}
          suppressHydrationWarning={true}
        >
          {t("nav.network.title")}
          {showNetwork ? UpIcon : DownIcon}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <HeaderListNetwork />
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        as="li"
        className={`nav-item`}
        onToggle={(isOpen) => {
          isOpen ? updateShowCommunity(true) : updateShowCommunity(false);
        }}
        style={{ "--color-active": "#f087ff" }}
      >
        <Dropdown.Toggle
          as="button"
          type="button"
          className={`nav-link nav-link--primary dropdown-toggle ${
            isCommunityActive && "active"
          }`}
          suppressHydrationWarning={true}
        >
          {t("nav.community.title")}
          {showCommunity ? UpIcon : DownIcon}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <HeaderListCommunity />
        </Dropdown.Menu>
      </Dropdown>
    </ul>
  );
};

export default HeaderList;
