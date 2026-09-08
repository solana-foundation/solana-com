import { getMetadataFromSlug, MainDocsPage } from "../(main)/docs";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  return (
    <MainDocsPage slug={["roadmap"]} locale={locale} showPageActions={false} />
  );
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return getMetadataFromSlug(["roadmap"], locale);
}
