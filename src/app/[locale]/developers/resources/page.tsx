import { resources } from "@/app/source";
import { ResourcesIndex } from "./resources";

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

export async function generateMetadata() {
  return {
    title: "Developer Resources",
    description:
      "Discover developer resources for the Solana ecosystem. Documentation, tooling, frameworks, sdks, and more.",
  };
}
