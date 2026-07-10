import { Link } from "@workspace/i18n/routing";

interface Props {
  active: "wallet" | "validator";
  walletLabel: string;
  validatorLabel: string;
}

export default function Epoch1000EditionNav({
  active,
  walletLabel,
  validatorLabel,
}: Props) {
  const walletClass =
    active === "wallet"
      ? "text-ep-ink"
      : "text-ep-dust hover:text-ep-ink transition-colors duration-200";
  const validatorClass =
    active === "validator"
      ? "text-sol-gradient"
      : "text-sol-gradient hover:opacity-80 transition-opacity duration-200";

  return (
    <nav
      aria-label="Epoch 1000 editions"
      className="flex items-center gap-2 text-xs font-brand-mono shrink-0"
    >
      <Link
        href="/epoch1000#checker"
        className={`rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${walletClass}`}
      >
        {walletLabel}
      </Link>
      <span className="text-ep-edge" aria-hidden>
        |
      </span>
      <Link
        href="/epoch1000/validator#checker"
        className={`rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${validatorClass}`}
      >
        {validatorLabel}
      </Link>
    </nav>
  );
}
