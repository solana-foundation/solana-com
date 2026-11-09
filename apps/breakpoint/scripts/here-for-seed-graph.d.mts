export type SeedPerson = {
  id: string;
  handle: string;
  claimed: boolean;
  targets: SeedPerson[];
  adders: SeedPerson[];
};

export function generateSeedGraph(
  seed: number,
  count: number,
): {
  people: SeedPerson[];
  communities: SeedPerson[][];
  pods: { members: SeedPerson[]; friend: SeedPerson | null }[];
};
