import { Link } from "@workspace/i18n/routing";
import { Button } from "@/components/ui/button";
import React from "react";

type CTAButton = {
  label: string;
  url: string;
};

export type CallToActionProps = {
  eyebrow?: string;
  headline?: string;
  description?: string;
  button: CTAButton;
  className?: string;
};

function getText(v?: string) {
  if (!v) return "";
  return typeof v === "string" ? v : "";
}

export function CallToAction(props: CallToActionProps) {
  const eyebrow = getText(props.eyebrow);
  const headline = getText(props.headline);
  const description = getText(props.description);
  const label = getText(props.button?.label);

  if (!props.button?.url || !label) return null;

  return (
    <div className={props.className}>
      <div className="max-w-[200px] p-4 border border-border/50 rounded-md">
        {eyebrow ? (
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}

        {headline ? (
          <h3 className="text-balance text-4xl font-semibold lg:text-2xl">
            {headline}
          </h3>
        ) : null}

        {description ? (
          <p className="mt-4 text-muted-foreground">{description}</p>
        ) : null}

        <div className="mt-8">
          <Button asChild variant="outline" size="lg">
            <Link
              href={props.button.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-nowrap">{label}</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
