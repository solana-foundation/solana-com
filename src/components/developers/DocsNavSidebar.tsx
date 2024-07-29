import { memo, useCallback, useEffect, useState } from "react";
import ContentApi from "@/utils/contentApi";
import classNames from "classnames";
import Link from "next/link";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

import ChevronDown from "@/../assets/developers/chevron-down.inline.svg";
import {
  DocsNavSidebarProps,
  SidebarFolderProps,
  SidebarMenuChildrenProps,
  SidebarMenuProps,
} from "@/types";

/**
 * Component to memoize and render the on-page Sidebar nav for the Docs page,
 * based on the NAV file from the developer-content repo
 */
const DocsNavSidebar = memo(
  ({
    docsNav,
    className = "",
    currentPath = "",
    isExpandedDefault = false,
  }: DocsNavSidebarProps) => {
    // show nothing if we are unable to locate the provided `docsNav`
    if (!docsNav || docsNav?.length <= 0) return <></>;

    // Modify the sidebar structure
    const modifiedDocsNav = docsNav
      // Filter out items where isHiddenInSideNavbar is true
      .filter((folder) => !folder.isHiddenInNavSidebar)
      // Change "docs-intro" section header to route to "/docs" while preserving "docs/intro/" subpaths
      .map((folder) => {
        if (folder.id === "docs-intro") {
          return Object.assign(folder, { href: "/docs" });
        }
        return folder;
      });

    return (
      <div className={classNames(className)}>
        <ul className={styles["developers-content-page__sidebarGroup"]}>
          {modifiedDocsNav?.map((folder, key) => (
            <SidebarFolder
              key={key}
              folder={folder}
              currentPath={currentPath}
              isExpandedDefault={isExpandedDefault}
            />
          ))}
        </ul>
      </div>
    );
  },
);

export default DocsNavSidebar;

/**
 *
 */
const SidebarFolder = memo(
  ({ currentPath, folder, isExpandedDefault }: SidebarFolderProps) => {
    //
    const isInFolder = ContentApi.slugify(currentPath).startsWith(
      ContentApi.slugify(folder.id).replace("content-", "developers-"),
    );

    // track the open state of the menu item
    const [isOpen, setIsOpen] = useState(true);

    const ComponentToUse = !!folder?.href ? Link : "button";

    //
    const handleToggle = useCallback(() => {
      setIsOpen(!isOpen);
    }, [setIsOpen, isOpen]);

    useEffect(() => {
      if (isInFolder) setIsOpen(true);
    }, [isInFolder, currentPath]);

    return (
      <li>
        <div
          className={classNames(
            styles["developers-content-page__sidebarGroup__sectionHeader"],
            isInFolder
              ? styles[
                  "developers-content-page__sidebarGroup__sectionHeader__active"
                ]
              : undefined,
          )}
          // onClick={!!folder?.href ? undefined : handleToggle}
          aria-label="Toggle"
        >
          <div
            className={
              styles[
                "developers-content-page__sidebarGroup__sectionHeader__heading"
              ]
            }
          >
            <ComponentToUse
              href={folder.href}
              className={
                isInFolder
                  ? styles[
                      "developers-content-page__sidebarGroup__sectionHeader__heading__active"
                    ]
                  : undefined
              }
            >
              {folder.label}
            </ComponentToUse>
          </div>

          {!!folder.items?.length && (
            <span
              onClick={handleToggle}
              aria-label="Toggle"
              className={
                styles["developers-content-page__sidebarGroup__toggleBtn"]
              }
            >
              <ChevronDown
                style={{
                  rotate: isOpen ? "180deg" : undefined,
                }}
                width={24}
                height={24}
              />
            </span>
          )}
        </div>

        <SidebarMenu
          isExpandedDefault={isExpandedDefault}
          isInFolder={isInFolder}
          isOpen={isOpen}
          navItems={folder?.items}
          currentPath={currentPath}
        />
      </li>
    );
  },
);

/**
 *
 */
const SidebarMenu = memo(
  ({
    isExpandedDefault,
    navItems,
    currentPath,
    nestedCount = 1,
    isOpen = true,
    isInFolder = false,
  }: SidebarMenuProps) => {
    // do nothing if there are no child items
    if (!navItems?.length) return <></>;

    return (
      <ul
        style={{
          display: !isOpen ? "none" : undefined,
          borderColor: isInFolder ? "var(--mdx-details-border)" : undefined,
        }}
      >
        {navItems.map((section, key) => (
          <SidebarMenuChildren
            isExpandedDefault={isExpandedDefault}
            key={key}
            section={section}
            currentPath={currentPath}
            nestedCount={nestedCount}
          />
        ))}
      </ul>
    );
  },
);

/**
 *
 */
const SidebarMenuChildren = memo(
  ({
    section,
    currentPath,
    nestedCount,
    isExpandedDefault,
  }: SidebarMenuChildrenProps) => {
    const hasNested = Array.isArray(section.items) && section.items.length > 0;

    // !note: adding the separator string `-` prevents similarly named pages to become false positives
    const isInSection = ContentApi.slugify(currentPath).startsWith(
      ContentApi.slugify(section.id).replace("content-", "developers-") + "-",
    );

    // determine the specific component type to use
    const ComponentToUse = !!section.href ? Link : "button";

    // track the open state of the menu item
    const [isOpen, setIsOpen] = useState(isExpandedDefault);

    // create a callback function to handle the state changes
    const toggleOpen = useCallback(
      (e) => {
        const clickedToggleIcon = ["img", "svg", "path"].includes(
          e.target?.tagName.toLowerCase(),
        );
        if (clickedToggleIcon) e.preventDefault();
        setIsOpen(!isOpen);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [setIsOpen, isOpen, section.href],
    );

    // auto expand the parent section for active child members
    useEffect(() => {
      if (isInSection) setIsOpen(true);
    }, [isInSection, currentPath, section.id]);

    return (
      <li>
        <ComponentToUse
          href={section.href}
          className={
            currentPath == section.href
              ? styles[
                  "developers-content-page__sidebarGroup__list__active-link"
                ]
              : isInSection
                ? styles[
                    "developers-content-page__sidebarGroup__list__active-section"
                  ]
                : undefined
          }
          style={{
            paddingLeft: 18 * nestedCount,
          }}
          onClick={toggleOpen}
        >
          {section.label}

          {hasNested && (
            <span
              onClick={toggleOpen}
              aria-label="Toggle"
              className={
                styles["developers-content-page__sidebarGroup__toggleBtn"]
              }
            >
              <ChevronDown
                style={{
                  rotate: isOpen ? "180deg" : undefined,
                }}
                width={24}
                height={24}
              />
            </span>
          )}
        </ComponentToUse>

        {hasNested && (
          <SidebarMenu
            isExpandedDefault={isExpandedDefault}
            isOpen={isOpen}
            navItems={section.items}
            currentPath={currentPath}
            nestedCount={nestedCount + 1}
          />
        )}
      </li>
    );
  },
);
