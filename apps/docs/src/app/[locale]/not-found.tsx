"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import NotFoundImg from "@@/public/img/not-found.png";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="container py-20">
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
        <div className="w-full md:w-1/2 lg:w-8/12 md:order-2">
          <Image src={NotFoundImg} alt="Not Found" />
        </div>
        <div className="w-full md:w-1/2 lg:w-4/12 md:order-1">
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
