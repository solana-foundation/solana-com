import { FinanceDocsPage, getMetadataFromSlug } from "./finance";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  return <FinanceDocsPage slug={["finance"]} locale={locale} />;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return getMetadataFromSlug(["finance"], locale);
}
