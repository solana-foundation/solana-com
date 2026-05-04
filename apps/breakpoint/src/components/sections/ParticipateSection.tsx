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
      className="w-full min-[1200px]:w-auto"
      href={action.href}
      label={t(`participate.actions.${action.key}.label`)}
      variant={action.variant}
    />
  );
}

export default function ParticipateSection() {
  const t = useTranslations("breakpoint");
  return (
    <section
      id="get-involved"
      className="mt-2xl min-h-[592px] bg-background-secondary md:mt-[120px] md:min-h-0"
    >
      <div className="px-m py-2xl min-[1200px]:flex min-[1200px]:items-end min-[1200px]:justify-center min-[1200px]:gap-[40px] min-[1200px]:p-2xl">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-s min-[1200px]:items-start">
          <p className="type-eyebrow text-center text-white min-[1200px]:text-left">
            {t("participate.eyebrow")}
          </p>
          <h2 className="w-full text-center font-sans text-[28px] leading-[1.2] tracking-[-0.56px] text-white min-[1200px]:text-left min-[1200px]:text-[40px] min-[1200px]:leading-[1.15] min-[1200px]:tracking-[-0.8px]">
            {t("participate.headline")}
          </h2>
        </div>

        <div className="mt-[40px] flex w-full flex-col items-center justify-center gap-xs min-[1200px]:mt-0 min-[1200px]:w-auto min-[1200px]:flex-row">
          {PARTICIPATE_ACTIONS.map((action) => (
            <ParticipateButton key={action.key} action={action} />
          ))}
        </div>
      </div>
    </section>
  );
}
