"use client";

import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import {
  CONTENT_CREATOR_APPLICATION_HREF,
  PRESS_APPLICATION_HREF,
  SPONSOR_FORM_HREF,
} from "@/content/links";

const PARTICIPATE_ACTIONS = [
  {
    href: SPONSOR_FORM_HREF,
    key: "sponsor",
    variant: "primary",
  },
  {
    href: PRESS_APPLICATION_HREF,
    key: "press",
    variant: "secondary",
  },
  {
    href: CONTENT_CREATOR_APPLICATION_HREF,
    key: "creator",
    variant: "secondary",
  },
] satisfies {
  href: string;
  key: "creator" | "press" | "sponsor";
  variant: "primary" | "secondary";
}[];

type ParticipateAction = (typeof PARTICIPATE_ACTIONS)[number];

function ParticipateButton({ action }: { action: ParticipateAction }) {
  const t = useTranslations("breakpoint");

  return (
    <Button
      arrow
      className="w-full md:w-auto"
      href={action.href}
      label={t(`participate.actions.${action.key}.label`)}
      variant={action.variant}
    />
  );
}

export default function ParticipateSection() {
  const t = useTranslations("breakpoint");
  return (
    <section id="get-involved" className="mt-2xl bg-black md:mt-[120px]">
      <div className="container">
        <div className="flex min-h-[356px] flex-col items-center justify-center bg-background-secondary px-xs py-2xl text-center md:px-m">
          <div className="flex flex-col items-center gap-s">
            <p className="type-eyebrow text-white">
              {t("participate.eyebrow")}
            </p>
            <h2 className="font-sans text-[28px] leading-[1.2] tracking-[-0.56px] text-white md:text-[40px] md:leading-[1.15] md:tracking-[-0.8px]">
              {t("participate.headline")}
            </h2>
          </div>

          <div className="mt-[40px] flex w-full flex-col items-center justify-center gap-xs md:w-auto md:flex-row">
            {PARTICIPATE_ACTIONS.map((action) => (
              <ParticipateButton key={action.key} action={action} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
