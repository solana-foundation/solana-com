import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

const CTACards = () => {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          aria-labelledby="cta-report-title"
          className="relative col-span-1 md:col-span-2 bg-[radial-gradient(circle,_#903dc5_0%,_#5831b5_50%)] rounded-2xl p-8 flex flex-col items-center text-center shadow-lg overflow-hidden"
        >
          {/* Pseudo-element for concentric circles */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `
                repeating-radial-gradient(
                  circle at 50% 50%,
                  rgba(255,255,255,0.05) 0px,
                  rgba(255,255,255,0.05) 1px,
                  transparent 2px,
                  transparent 150px
                )
              `,
              borderRadius: "1rem",
            }}
          />
          <div className="relative z-10 flex flex-col items-center py-8">
            <h3
              id="cta-report-title"
              className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-xs"
            >
              {t("depin.cta.reportTitle")}
            </h3>
            <Button
              variant="default"
              className="text-lg p-5 rounded-xl transition-colors duration-200 shadow-md"
              aria-label={t("depin.cta.downloadReport")}
            >
              {t("depin.cta.downloadReport")}{" "}
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="bg-[#303742] rounded-2xl flex flex-col shadow-lg max-h-[400px] pt-6 px-6 pb-0 overflow-hidden">
          <h4 className="text-2xl font-semibold text-white mb-3">
            {t("depin.cta.developerResourcesTitle")}
          </h4>
          <p className="text-white/80 mb-6">
            {t("depin.cta.developerResourcesDescription")}
          </p>
          <div className="flex flex-col gap-3 mb-6">
            <Link
              href="/developers/guides/depin/getting-started"
              className="text-[#fff] flex items-center gap-1 hover:underline transition text-sm"
            >
              {t("depin.cta.quickstartGuide")}
              <ArrowRightIcon size={18} />
            </Link>
            <Link
              href="https://github.com/solana-developers/solana-depin-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b3b8c5] flex items-center gap-1 hover:underline transition text-sm"
            >
              {t("depin.cta.examples")}
              <ArrowRightIcon size={16} />
            </Link>
          </div>
          <div className="relative w-full flex-1 min-h-[180px]">
            <Image
              src="/src/img/solutions/depin/dev-resources.png"
              alt={t("depin.cta.developerResourcesTitle")}
              fill
              className="rounded-lg object-cover object-top"
              priority={false}
            />
          </div>
        </div>

        <div className="bg-[#212030] rounded-2xl p-6 flex flex-col shadow-lg min-h-[280px]">
          <h4 className="text-2xl font-semibold text-white mb-3">
            {t("depin.cta.getHelpTitle")}
          </h4>
          <p className="text-white/80 mb-6">
            {t("depin.cta.getHelpDescription")}
          </p>
          <div className="mt-auto flex gap-4">
            <Link
              href="/grants-funding"
              className="bg-[#7b47ff] hover:bg-[#441caa] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base"
            >
              {t("depin.cta.applyForGrant")}
            </Link>
            <Link
              href="https://talent.superteam.fun/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 text-base hover:bg-[#2a223d] outline outline-2 outline-[#7b47ff] outline-offset-[-2px]"
            >
              <span className="inline-block leading-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 28 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="align-middle"
                >
                  <path
                    d="M22.2635 3.2217H27.9653V5.43985C27.9653 8.44821 25.5517 10.8797 22.5655 10.8797H22.2635V3.2217ZM14.1488 0H22.2635V20.9392H21.2979C15.4156 20.9392 14.239 16.8063 14.239 13.1287L14.1488 0ZM0.965332 4.74129C0.965332 8.47902 3.61977 9.84688 6.57619 10.3028H0.965332V21H6.36518C11.7956 21 12.4286 18.5685 12.4286 16.2587C12.4286 13.4321 10.4982 11.4573 7.5112 10.6972H12.4286V0H7.02879C1.59912 0 0.965332 2.43149 0.965332 4.74129Z"
                    fill="#7B47FF"
                  />
                </svg>
              </span>
              {t("depin.cta.findTalent")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CTACards };
