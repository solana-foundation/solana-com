import type { Metadata } from "next";
import { EventAgendaPage } from "@/components/EventAgendaPage";
import { ChinaHeader } from "@/components/china/ChinaRoadshow";
import { accelerateEvents } from "@/data/events";
import type { AgendaData, AgendaSessionType } from "@/lib/agenda-types";
import { getShanghaiAgenda } from "@/lib/shanghai-agenda";
import { getShanghaiAgendaSessionText } from "@/lib/shanghai-agenda-mapper";
import { getPageMetadata } from "../../../metadata";
import { getTranslations } from "@workspace/i18n/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });

  return getPageMetadata({
    locale,
    path: "/china/agenda",
    title: "Shanghai agenda | Solana Accelerate",
    description: "Solana Accelerate Shanghai sessions, October 16, 2026.",
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate Shanghai agenda",
      "Shanghai Solana conference agenda",
    ],
  });
}

function getSessionType(formats: readonly string[] = []): AgendaSessionType {
  const format = formats.join(" ").toLowerCase();
  if (/break|lunch/.test(format)) return "break";
  if (/closing/.test(format)) return "closing";
  if (/demo/.test(format)) return "demo";
  if (/fireside/.test(format)) return "fireside";
  if (/keynote|opening|welcome/.test(format)) return "keynote";
  if (/lightning|short talk|tech sharing/.test(format)) return "lightning";
  return "panel";
}

export default async function ShanghaiAgendaPage({ params }: PageProps) {
  const { locale } = await params;
  const result = await getShanghaiAgenda();
  const sessions =
    result.status === "ready"
      ? result.sessions.map((session) => {
          const { title, description } = getShanghaiAgendaSessionText(
            session,
            locale,
          );
          return {
            id: session.id,
            time: session.time?.label,
            title,
            subtitle: description,
            type: getSessionType(session.formats),
            formats: session.formats,
            track: session.track,
          };
        })
      : [];
  const data: AgendaData = { sessions };

  return (
    <>
      <EventAgendaPage
        header={<ChinaHeader />}
        headerOverlay
        data={data}
        event={accelerateEvents.shanghai}
        copy={{
          backToAccelerate: "Back to Accelerate China",
          dateLocation: "October 16, 2026 / Shanghai",
          conference: "Shanghai",
          agendaHighlight: "agenda",
          description: "",
          comingSoon:
            result.status === "unavailable"
              ? "The Shanghai agenda is temporarily unavailable. Please check back soon."
              : "No Shanghai sessions have been published yet. Please check back soon.",
        }}
      />
    </>
  );
}
