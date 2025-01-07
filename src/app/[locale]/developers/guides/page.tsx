import { guidesSource } from "@/app/source";
import { GuidesIndex } from "./guides";

export default function Page() {
  const records = getGuidesFromFolder(guidesSource.pageTree);
  const featured = records.filter((record: any) => record.featured).slice(0, 3);
  return (
    <div className="my-8 px-5 max-w-[1120px] w-full mx-auto">
      <GuidesIndex records={records} featured={featured} />
    </div>
  );
}

function getGuidesFromFolder(folder: any) {
  return folder.children.flatMap((node: any) => {
    if (node.children) {
      return getGuidesFromFolder(node);
    } else {
      return [
        {
          href: node.href || node.url,
          title: node.name,
          description: node.description,
          difficulty: node.difficulty,
          tags: node.tags,
          featured: node.featured,
        },
      ];
    }
  });
}

export async function generateMetadata() {
  return {
    title: "Developer Guides",
    description:
      "Learn Solana development with developer guides, from beginner to advanced. JavaScript, TypeScript, Rust, and more.",
  };
}
