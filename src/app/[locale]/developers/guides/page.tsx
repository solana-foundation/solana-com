import { getGuides } from "@/app/sources/guides";
import { GuidesIndex } from "./guides";
import { getAlternates } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;
  const guides = getGuides(locale);
  const featured = guides.filter((guide: any) => guide.featured).slice(0, 3);
  return (
    <div className="my-8 px-5 max-w-[1120px] w-full mx-auto">
      <GuidesIndex records={guides} featured={featured} />
    </div>
  );
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;
  return {
    title: "Developer Guides",
    description:
      "Learn Solana development with developer guides, from beginner to advanced. JavaScript, TypeScript, Rust, and more.",
    alternates: getAlternates("/developers/guides", locale),
  };
}
