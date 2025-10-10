import { Button } from "@/components/ui/button";
import { useRepokitFilterState } from "@/lib/repokit";

export function TemplatesUiFilterHeader() {
  const { clear, isFiltered } = useRepokitFilterState();
  return (
    <div className="flex justify-between items-center">
      <span className="text-md font-bold py-1.5">Filter Templates</span>
      {isFiltered ? (
        <Button variant="outline" onClick={() => clear()}>
          Clear
        </Button>
      ) : null}
    </div>
  );
}
