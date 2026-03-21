"use client";

import CodeIcon from "./assets/nav/code.inline.svg";
import BezierIcon from "./assets/nav/bezier.inline.svg";
import GlobusIcon from "./assets/nav/globus.inline.svg";
import LightbulbIcon from "./assets/nav/lightbulb.inline.svg";
import HeaderListLearn from "./header-list.learn";
import HeaderListBuild from "./header-list.build";
import HeaderListSolutions from "./header-list.solutions";
import HeaderListNetwork from "./header-list.network";
import { HeaderListCommunity } from "./header-list.community";
import { HEADER_SECTION_METADATA } from "./header-section-metadata";
import type { NavTopLevelSection } from "./nav-types";

const HEADER_SECTION_ICONS = {
  learn: CodeIcon,
  developers: CodeIcon,
  solutions: LightbulbIcon,
  network: BezierIcon,
  community: GlobusIcon,
} as const;

const HEADER_SECTION_CONTENT = {
  learn: HeaderListLearn,
  developers: HeaderListBuild,
  solutions: HeaderListSolutions,
  network: HeaderListNetwork,
  community: HeaderListCommunity,
} as const;

export const HEADER_SECTIONS: NavTopLevelSection[] =
  HEADER_SECTION_METADATA.map((section) => ({
    ...section,
    mobileIcon: HEADER_SECTION_ICONS[section.id],
    Content: HEADER_SECTION_CONTENT[section.id],
  }));
