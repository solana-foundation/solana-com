import { Button } from "@/components/ui/button";
import { useRepokitFilterState } from "@/lib/repokit";

export function TemplatesUiFilterKeywords() {
  const { filters, selectedKeywords, toggleKeyword } = useRepokitFilterState();
  return filters.map((filter) => (
    <div className="flex flex-col gap-2" key={filter.id}>
      <div className={"text-md font-bold py-1.5"}>{filter.name}</div>
      <div className="flex gap-2 flex-wrap">
        {filter.keywords.map((keyword) => (
          <Button
            onClick={() => toggleKeyword(keyword.id)}
            className={`rounded-full solana-border w-fit p-0 h-fit cursor-pointer ${selectedKeywords.includes(keyword.id) ? "selected opacity-100" : "opacity-50 hover:opacity-100"}`}
            variant={
              selectedKeywords.includes(keyword.id) ? "default" : "outline"
            }
            key={keyword.id}
          >
            <span className="bg-slate-900 rounded-full px-4 py-1 text-white">
              {keyword.name}
            </span>
          </Button>
        ))}
      </div>
    </div>
  ));
}
