import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import { useTranslation } from "next-i18next";

const CTACards = () => {
  const { t } = useTranslation("common");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative col-span-1 md:col-span-2 bg-[radial-gradient(circle,_#903dc5_0%,_#5831b5_50%)] rounded-2xl p-8 flex flex-col items-center text-center shadow-lg overflow-hidden">
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
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t("depin.cta.reportTitle")}
            </h3>
            <p className="text-white/80 mb-6 max-w-2xl">
              {t("depin.cta.reportDescription")}
            </p>
            <Button
              variant="default"
              className="text-lg px-8 py-5 rounded-xl transition-colors duration-200 shadow-md"
            >
              {t("depin.cta.downloadReport")} <ArrowDownToLine />
            </Button>
          </div>
        </div>

        <div className="bg-[#303742] rounded-2xl flex flex-col shadow-lg max-h-[400px] pt-6 px-6 pb-0">
          <h4 className="text-lg font-semibold text-white mb-3">
            {t("depin.cta.developerResourcesTitle")}
          </h4>
          <p className="text-white/80 mb-6">
            {t("depin.cta.developerResourcesDescription")}
          </p>
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

        <div className="bg-[#212030] rounded-2xl p-6 flex flex-col shadow-lg">
          <h4 className="text-lg font-semibold text-white mb-3">
            {t("depin.cta.getHelpTitle")}
          </h4>
          <p className="text-white/80 mb-6">
            {t("depin.cta.getHelpDescription")}
          </p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#7b47ff] hover:bg-[#441caa] text-white font-semibold px-6 py-3 rounded-lg max-w-[200px] self-start transition-colors duration-200"
          >
            {t("depin.cta.getInTouch")}
          </a>
        </div>
      </div>
    </div>
  );
};

export { CTACards };
