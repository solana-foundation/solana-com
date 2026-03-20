import { getIndexMetadata } from "@/app/metadata";
import { SdpPage } from "./sdp";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const baseMeta = await getIndexMetadata({
    titleKey: "sdp.meta.seoTitle",
    descriptionKey: "sdp.meta.seoDescription",
    path: "/solutions/sdp",
    locale,
  });
  return {
    ...baseMeta,
    openGraph: {
      images: "/src/img/solutions/sdp/og-image.jpg",
    },
  };
}

export default async function Page(_props: Props) {
  return <SdpPage />;
}
