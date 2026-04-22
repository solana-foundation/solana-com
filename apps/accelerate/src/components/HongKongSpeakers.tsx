import { getHongKongSpeakers } from "@/lib/hong-kong-speakers";
import { Speakers } from "./Speakers";

export async function HongKongSpeakers() {
  const speakers = await getHongKongSpeakers();
  if (!speakers?.length) return null;

  return <Speakers speakers={speakers} />;
}
