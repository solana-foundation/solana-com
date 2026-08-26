import { EnterpriseFaqPage } from "./enterprise-faq";
import { getAlternates } from "@workspace/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default function Page() {
  return <EnterpriseFaqPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  return {
    title: "Enterprise FAQ | Solana",
    description:
      "Common questions from institutions exploring Solana — chain migration, privacy, tokenized funds, payments and settlement, custody, compliance, and yield — answered in plain language for business and partnership teams.",
    alternates: getAlternates("/enterprise/faq", locale),
  };
}
