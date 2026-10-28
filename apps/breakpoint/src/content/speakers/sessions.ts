import type { AgendaItem } from "@/content/agenda/types";
import type { BreakpointSpeaker } from "@/content/speakers/types";

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function attachSpeakerSessions(
  speakers: BreakpointSpeaker[],
  agenda: AgendaItem[],
): BreakpointSpeaker[] {
  return speakers.map((speaker) => ({
    ...speaker,
    sessions: agenda
      .filter((item) =>
        item.speakerIds?.length
          ? item.speakerIds.includes(speaker.id)
          : item.speakers.some(
              (presenter) =>
                normalize(presenter.name) === normalize(speaker.name) &&
                (!presenter.company ||
                  !speaker.company ||
                  normalize(presenter.company) === normalize(speaker.company)),
            ),
      )
      .map((item) => ({
        id: item.id,
        day: item.day,
        format: item.tag,
        title: item.title,
      })),
  }));
}
