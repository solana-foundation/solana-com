import { Input } from "@/components/ui/input";
import { useRepokitFilterState } from "@/lib/repokit";

export function TemplatesUiFilterSearch() {
  const { filter, setFilter } = useRepokitFilterState();

  return (
    <Input
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder="Filter templates..."
    />
  );
}
