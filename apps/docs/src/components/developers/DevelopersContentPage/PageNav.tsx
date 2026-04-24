import classNames from "classnames";
import styles from "./DevelopersContentPage.module.scss";
import Link from "next/link";
import { useTranslations } from "next-intl";

type NavLink = {
  href: string;
  label: string;
};

type PageNavProps = {
  nav: {
    prev?: NavLink | null;
    next?: NavLink | null;
  };
};

export const PageNav = ({ nav }: PageNavProps) => {
  const t = useTranslations();

  return (
    <div
      className={classNames(
        styles["developers-content-page__nav"],
        "flex flex-col md:flex-row justify-between mt-20 small",
      )}
    >
      {nav.prev ? (
        <Link href={nav.prev.href}>
          <span>{t("developers.nav.prev")}</span>
          <div>« {nav.prev.label}</div>
        </Link>
      ) : (
        <div>{/* flex display placeholder when index is first item */}</div>
      )}

      {nav.next ? (
        <Link href={nav.next.href}>
          <span>{t("developers.nav.next")}</span>
          <div>{nav.next.label} »</div>
        </Link>
      ) : (
        <div>{/* flex display placeholder when index is last item*/}</div>
      )}
    </div>
  );
};
