import { resources } from "@/app/sources/resources";
import { ResourcesIndex } from "./resources";
import { getAlternates } from "@/i18n/routing";

export default function Page() {
  const featured = resources
    .filter((record: any) => record.featured)
    .slice(0, 3);
  return (
    <div className="my-8 px-5 max-w-[1120px] w-full mx-auto">
      <ResourcesIndex records={resources} featured={featured} />
    </div>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  return {
    title: "Developer Resources",
    description:
      "Discover developer resources for the Solana ecosystem. Documentation, tooling, frameworks, sdks, and more.",
    alternates: getAlternates("/developers/resources", locale),
  };
}
