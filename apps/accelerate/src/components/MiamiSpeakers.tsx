import { getMiamiSpeakers } from "@/lib/miami-speakers";
import { Speakers } from "./Speakers";

export async function MiamiSpeakers() {
  const speakers = await getMiamiSpeakers();
  if (!speakers?.length) return null;

  return <Speakers speakers={speakers} speakerOrder={null} />;
}
