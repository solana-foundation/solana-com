import { getGuides } from "@/app/source";
import { GuidesIndex } from "./guides";

export default function Page() {
  const guides = getGuides();
  const featured = guides.filter((guide: any) => guide.featured).slice(0, 3);
  return (
    <div className="my-8 px-5 max-w-[1120px] w-full mx-auto">
      <GuidesIndex records={guides} featured={featured} />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "Developer Guides",
    description:
      "Learn Solana development with developer guides, from beginner to advanced. JavaScript, TypeScript, Rust, and more.",
  };
}
