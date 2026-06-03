"use client";

import CodeIcon from "./assets/nav/code.inline.svg";
import BezierIcon from "./assets/nav/bezier.inline.svg";
import GlobusIcon from "./assets/nav/globus.inline.svg";
import LightbulbIcon from "./assets/nav/lightbulb.inline.svg";
import BuildingsIcon from "./assets/nav/solutions/buildings.inline.svg";
import HeaderListUseSolana from "./header-list.use-solana";
import HeaderListBuild from "./header-list.build";
import HeaderListEnterprise from "./header-list.enterprise";
import HeaderListProducts from "./header-list.products";
import HeaderListEcosystem from "./header-list.ecosystem";
import { HEADER_SECTION_METADATA } from "./header-section-metadata";
import type { NavTopLevelSection, NavTopLevelSectionId } from "./nav-types";

const HEADER_SECTION_ICONS: Record<
  NavTopLevelSectionId,
  NavTopLevelSection["mobileIcon"]
> = {
  use_solana: LightbulbIcon,
  build: CodeIcon,
  enterprise: BuildingsIcon,
  products: BezierIcon,
  ecosystem: GlobusIcon,
};

const HEADER_SECTION_CONTENT: Record<
  NavTopLevelSectionId,
  NavTopLevelSection["Content"]
> = {
  use_solana: HeaderListUseSolana,
  build: HeaderListBuild,
  enterprise: HeaderListEnterprise,
  products: HeaderListProducts,
  ecosystem: HeaderListEcosystem,
};

export const HEADER_SECTIONS: NavTopLevelSection[] =
  HEADER_SECTION_METADATA.map((section) => ({
    ...section,
    mobileIcon: HEADER_SECTION_ICONS[section.id],
    Content: HEADER_SECTION_CONTENT[section.id],
  }));
