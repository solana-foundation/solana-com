import { BrandingPage } from "./branding";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <BrandingPage />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "branding.title",
    descriptionKey: "branding.description",
    path: "/branding",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ["/src/img/branding/solanaLogo.png"],
    },
  };
}
