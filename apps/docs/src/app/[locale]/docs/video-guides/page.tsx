import { VideoGuidesDocsPage, getMetadataFromSlug } from "./video-guides";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(props: Props) {
  const { locale } = await props.params;
  return <VideoGuidesDocsPage slug={["video-guides"]} locale={locale} />;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return getMetadataFromSlug(["video-guides"], locale);
}
