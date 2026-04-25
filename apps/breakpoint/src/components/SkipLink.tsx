type SkipLinkProps = {
  label?: string;
  targetId: string;
};

export default function SkipLink({
  label = "Skip to content",
  targetId,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
    >
      {label}
    </a>
  );
}
