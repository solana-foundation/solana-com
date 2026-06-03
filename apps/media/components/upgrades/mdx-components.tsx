import React, { ComponentPropsWithoutRef } from "react";

export function StatusBadge({
  children,
  color = "green",
}: {
  children: React.ReactNode;
  color?: "green" | "yellow" | "red" | "purple";
}) {
  const colorMap: Record<string, string> = {
    green: "bg-[#14F195]/10 border-[#14F195]/30 text-[#14F195]",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  };
  return (
    <span
      className={`inline-block text-xs px-3 py-1 rounded-full border font-medium ${colorMap[color]}`}
    >
      {children}
    </span>
  );
}

export function StatusBadgeGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">{children}</div>
  );
}

export function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg p-6 border border-white/10">
      <div className="text-4xl font-bold bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

export function MetricCardGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-10">
      {children}
    </div>
  );
}

export const upgradeMdxComponents = {
  StatusBadge,
  StatusBadgeGroup,
  MetricCard,
  MetricCardGroup,
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-4xl md:text-5xl font-bold mb-6 mt-12 first:mt-0"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-16" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-2xl md:text-3xl font-semibold mb-4 mt-12" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="text-xl md:text-2xl font-semibold mb-3 mt-8" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-lg text-gray-300 mb-6 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside mb-6 space-y-3 text-gray-300 ml-4"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside mb-6 space-y-3 text-gray-300 ml-4"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-lg text-gray-300 leading-relaxed" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-[#14F195] hover:underline font-medium" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-[#14F195]"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-gray-900 p-6 rounded-lg overflow-x-auto mb-6 border border-white/10"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto mb-8">
      <table
        className="w-full border-collapse border border-white/10 rounded-lg"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-gray-900" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="border-b border-white/10" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-6 py-4 text-left text-sm font-semibold text-white"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-6 py-4 text-base text-gray-300" {...props} />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-12 border-white/20" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-[#14F195] pl-6 italic text-gray-400 my-8 text-lg"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic text-gray-200" {...props} />
  ),
};
