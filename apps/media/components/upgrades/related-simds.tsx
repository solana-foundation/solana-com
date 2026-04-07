export function RelatedSIMDs({ relatedSimds }: { relatedSimds: string[] }) {
  if (relatedSimds.length === 0) {
    return null;
  }

  return (
    <div className="text-xs leading-6 text-[#8f8fa3]">
      <span className="uppercase tracking-[0.18em] text-[#66667a]">
        Related
      </span>{" "}
      {relatedSimds.join(", ")}
    </div>
  );
}
