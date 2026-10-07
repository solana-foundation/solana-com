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
    title: t("chinaAgenda.title"),
    description: t("chinaAgenda.description"),
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
  const t = await getTranslations({
    locale,
    namespace: "accelerate.china.agenda",
  });
  const formatLabels = t.raw("formats") as Record<string, string>;
  const trackLabels = t.raw("tracks") as Record<string, string>;
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
            formats: session.formats?.map(
              (format) => formatLabels[format] ?? format,
            ),
            track: session.track
              ? (trackLabels[session.track] ?? session.track)
              : undefined,
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
        agendaLabels={{
          rightColumnLabel: t("track"),
          timeZoneLabel: t("timeZone"),
          searchPlaceholder: t("searchPlaceholder"),
          filterByTypeLabel: t("filterByFormat"),
        }}
        copy={{
          backToAccelerate: t("backToAccelerate"),
          dateLocation: t("dateLocation"),
          conference: t("conference"),
          agendaHighlight: t("agendaHighlight"),
          description: "",
          comingSoon:
            result.status === "unavailable"
              ? t("unavailable")
              : t("comingSoon"),
        }}
      />
    </>
  );
}
