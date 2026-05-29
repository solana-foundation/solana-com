import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { ArrowLeft, Twitter, Facebook, Linkedin, Send } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

function SocialShare({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm text-gray-400">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="size-5" />
      </a>
      <a
        href="https://www.facebook.com/sharer/sharer.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="size-5" />
      </a>
      <a
        href="https://www.linkedin.com/sharing/share-offsite/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="size-5" />
      </a>
      <a
        href="https://t.me/share/url"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#14F195] transition-colors"
        aria-label="Share on Telegram"
      >
        <Send className="size-5" />
      </a>
    </div>
  );
}

const mdxComponents = {
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

interface XdpPageProps {
  markdownContent: string;
}

export function XdpPage({ markdownContent }: XdpPageProps) {
  return (
    <div className="bg-black text-white min-h-screen">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 pt-8 md:pt-16">
          <div className="mb-8">
            <Link
              href="/upgrades"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#14F195] transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Upgrades</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs px-3 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/30 text-[#14F195] font-medium">
              🟢 Agave 4.x + Opt in
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-medium">
              🟢 Firedancer: Default on
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            XDP Networking
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl">
            Kernel-bypass networking for faster block propagation on Solana
          </p>

          <SocialShare title="XDP: Kernel-bypass networking for Solana validators" />

          <p className="text-base text-gray-400 mb-8">
            <span>May 2026</span>
            <span>, by </span>
            <span>Solana Foundation</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg p-6 border border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent mb-2">
                200x
              </div>
              <div className="text-sm text-gray-400">
                Latency Reduction vs. Standard Networking
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg p-6 border border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent mb-2">
                100M
              </div>
              <div className="text-sm text-gray-400">
                Compute Units per Block (Enabled by XDP)
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <article className="prose prose-invert prose-lg max-w-none">
            <MDXRemote
              source={markdownContent}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </article>
        </div>
      </section>
    </div>
  );
}
