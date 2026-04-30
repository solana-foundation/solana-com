import { Code } from "./code";
import { WithClientNotes } from "./notes.client";
import { RawCode } from "codehike/code";

export function WithNotes({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  // get all the blocks inside <WithNotes />
  // and put them into Context
  const notes = (
    Object.entries(rest) as [
      string,
      (
        | RawCode
        | {
            type?: "prose" | "code" | "image";
            children?: React.ReactNode;
            url?: string;
            alt?: string;
          }
      ),
    ][]
  )
    .filter(([name]) => name !== "title" && name !== "_data")
    .map(([name, block]) => {
      if ("children" in block) {
        return {
          name,
          type: block.type || ("prose" as const),
          children: block.children,
        };
      } else if ("value" in block && "lang" in block) {
        return {
          name,
          type: "code" as const,
          children: <Code codeblocks={[block]} />,
        };
      } else if ("url" in block && "alt" in block) {
        return {
          name,
          type: "image" as const,
          children: <img src={block.url} alt={block.alt} />,
        };
      } else {
        throw new Error("Invalid block inside <WithNotes />");
      }
    });
  return <WithClientNotes notes={notes}>{children}</WithClientNotes>;
}
