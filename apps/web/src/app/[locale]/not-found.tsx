"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import NotFoundImg from "@@/public/img/not-found.png";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="container py-10">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-6 col-lg-8 order-md-2">
          <Image src={NotFoundImg} alt="Not Found" />
        </div>
        <div className="col-md-6 col-lg-4 order-md-1">
          <h1 className="display-3 fw-bold text-center">{t("404.title")}</h1>
          <p className="mb-5 text-center subdued">{t("404.copy")}</p>
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
