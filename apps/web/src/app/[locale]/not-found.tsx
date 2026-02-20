"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import NotFoundImg from "@@/public/img/not-found.png";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="container py-10">
      <div className="grid grid-cols-12 items-center justify-center">
        <div className="col-span-12 md:col-span-6 lg:col-span-8 md:order-2">
          <Image src={NotFoundImg} alt="Not Found" />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4 md:order-1">
          <h1 className="display-3 font-bold text-center">{t("404.title")}</h1>
          <p className="mb-6 text-center subdued">{t("404.copy")}</p>
          <div className="text-center">
            <Link className="btn btn-primary" href="/">
              {t("404.button")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
