"use client";

import { Files, Folder, File } from "@/app/components/ui/files";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/app/components/utils";
import { Selection } from "codehike/utils/selection";

type StickerStep = {
  selected?: string;
  codeblocks: Record<string, React.ReactNode>;
};

export function SelectionSticker({ steps }: { steps: StickerStep[] }) {
  const stickerSteps = useMemo(() => {
    const files = {};
    return steps.map((step) => {
      Object.entries(step.codeblocks).forEach(([title, code]) => {
        files[title] = code;
      });
      return { ...step, codeblocks: { ...files } };
    });
  }, [steps]);

  return (
    <Selection
      from={stickerSteps.map((step) => (
        // eslint-disable-next-line react/jsx-key
        <Sticker step={step} />
      ))}
    />
  );
}

function Sticker(props: {
  step: { codeblocks: Record<string, React.ReactNode>; selected?: string };
}) {
  const { step } = props;
  const { codeblocks } = step;
  const filetree = useMemo(() => getFileTree(codeblocks), [codeblocks]);
  const defaultSelected = step.selected;
  const [selected, setSelected] = useState<string | null>(defaultSelected);

  useEffect(() => {
    if (defaultSelected) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  return (
    <>
      <Files className="flex-1 shrink-0">
        <FileNodes
          nodes={filetree}
          onSelect={setSelected}
          selected={selected}
        />
      </Files>
      {selected && codeblocks[selected]}
    </>
  );
}

function getFileTree(codeblocks: Record<string, React.ReactNode>) {
  const tree: TreeNode[] = [];
  const titles = Object.keys(codeblocks);
  for (const title of titles) {
    const parts = title.split("/");
    let node: TreeNode = { name: "", title: "", children: tree };

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let nextNode = node.children.find((child) => child.name === part);
      if (!nextNode) {
        nextNode = {
          name: part,
          title: parts.slice(0, i + 1).join("/"),
          children: [],
        };
        node.children.push(nextNode);
      }
      node = nextNode;
    }
  }
  return tree;
}

function FileNodes(props: {
  nodes: TreeNode[];
  onSelect: (_: string) => void;
  selected: string | null;
}) {
  const { nodes, onSelect, selected } = props;
  nodes.sort((a, b) => {
    if (a.children.length > 0 && b.children.length === 0) return -1;
    if (a.children.length === 0 && b.children.length > 0) return 1;
    return a.name.localeCompare(b.name);
  });

  return nodes.map((node) =>
    node.children.length > 0 ? (
      <Folder
        key={node.name}
        name={node.name}
        className="text-fd-muted-foreground"
        defaultOpen={true}
      >
        <FileNodes
          nodes={node.children}
          onSelect={onSelect}
          selected={selected}
        />
      </Folder>
    ) : (
      <File
        key={node.name}
        name={node.name}
        onClick={() => onSelect(node.title)}
        className={cn(
          "transition-colors duration-300",
          selected === node.title
            ? "bg-fd-primary/10 text-fd-primary"
            : "text-fd-muted-foreground",
        )}
      />
    ),
  );
}

type TreeNode = {
  name: string;
  title?: string;
  children: TreeNode[];
};

/**
 * Displays a codeblock only in the OneColumnLayout (small screens).
 */
export function CodePlaceholder({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { codeblocks } = useContext(CodePlaceholderContext);
  const codeblock = codeblocks[title];
  if (!codeblock) {
    return undefined;
  }
  return (
    <>
      {children}
      {codeblock}
    </>
  );
}

const CodePlaceholderContext = createContext<{
  codeblocks: Record<string, React.ReactNode>;
}>({
  codeblocks: {},
});

export function CodePlaceholderProvider({
  codeblocks,
  children,
}: {
  codeblocks: Record<string, React.ReactNode>;
  children: React.ReactNode;
}) {
  return (
    <CodePlaceholderContext.Provider value={{ codeblocks }}>
      {children}
    </CodePlaceholderContext.Provider>
  );
}
