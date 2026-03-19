const lines = Array.from({ length: 36 });

export const DecorGrid = (): React.ReactElement => {
  return (
    <div className="px-3 xl:px-0 border-t border-b border-white/[0.08]">
      <div className="w-full overflow-hidden">
        <div className="mx-auto max-w-[1440px]">
          <div className="w-full grid grid-cols-12 xl:grid-cols-[repeat(18,1fr)] grid-rows-2 mb-[-1px]">
            {lines.map((_, i) => {
              const isBottomRow = i >= 18;
              const ri = i % 18;
              return (
                <div
                  key={i}
                  className={`h-8 border-r border-white/[0.08] ${isBottomRow ? "" : "border-b border-white/[0.08]"} ${ri === 0 ? "border-l" : ""} ${ri > 11 ? "max-xl:hidden" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
