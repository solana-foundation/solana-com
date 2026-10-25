import { ArrowRight } from "@boxicons/react/ArrowRight";
import { Button } from "@/app/components/ui/button";
import { PRIVACY_CONTACT_EMAIL } from "@/data/solutions/privacy";

type PrivacyContactButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
};

/** Opens an email to the Solana Foundation privacy contact. */
export function PrivacyContactButton({
  label,
  variant = "primary",
  className,
}: PrivacyContactButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-nd-cta text-nd-inverse hover:bg-nd-primary/90"
      : "border border-nd-border-prominent bg-transparent text-white hover:bg-nd-border-light";

  return (
    <Button
      asChild
      size="lg"
      className={`h-12 rounded-full px-5 ${variantClass} ${className ?? ""}`}
    >
      <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>
        {label}
        <ArrowRight className="!size-4" aria-hidden="true" />
      </a>
    </Button>
  );
}
