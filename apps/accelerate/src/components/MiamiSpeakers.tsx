import { getMiamiSpeakers } from "@/lib/miami-speakers";
import { Speakers } from "./Speakers";

export async function MiamiSpeakers() {
  const speakers = await getMiamiSpeakers();

  return <Speakers speakers={speakers} speakerOrder={null} />;
}
