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
