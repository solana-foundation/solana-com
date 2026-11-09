"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import ImageTreatment from "@/components/ImageTreatment";
import SectionHeadline from "@/components/SectionHeadline";
import { publicAssetPath } from "@/config";
import type { AgendaItem } from "@/content/agenda/types";
import type { LiveStream } from "@/content/live/streams";
import {
  EVENT_TIME_ZONE,
  formatMinutes,
  sessionsForStage,
  stagesInSchedule,
  type LiveSession,
  type SessionStatus,
} from "@/lib/live-sessions";
import { useLiveSchedule } from "./use-live-schedule";

const UPCOMING_ROW_LIMIT = 8;

const STATUS_CLASSES: Record<SessionStatus, string> = {
  live: "text-core-green",
  next: "text-core-purple",
  later: "text-text-secondary",
  ended: "text-neutral-500",
};

type LiveEventSectionsProps = {
  initialItems: AgendaItem[];
  initialNow: number;
  stream: LiveStream;
};

function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex size-2 shrink-0 ${className}`}
    >
      <span className="absolute inset-0 animate-ping bg-core-green opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex size-2 bg-core-green" />
    </span>
  );
}

function sessionTimeRange(session: LiveSession) {
  return `${formatMinutes(session.startMinutes)}–${formatMinutes(session.endMinutes)}`;
}

function speakerNames(session: LiveSession) {
  return session.speakers.map((speaker) => speaker.name).join(", ");
}

function SessionCard({
  label,
  session,
  status,
}: {
  label: string;
  session: LiveSession;
  status: SessionStatus;
}) {
  const names = speakerNames(session);

  return (
    <div className="flex flex-col gap-3xs border-l-2 border-stroke-secondary pl-xs">
      <p
        className={`type-eyebrow flex items-center gap-2xs ${STATUS_CLASSES[status]}`}
      >
        {status === "live" && <LiveDot />}
        {label}
      </p>
      <p className="type-eyebrow text-text-secondary">
        {sessionTimeRange(session)}
      </p>
      <p className="type-h5 text-white">{session.title}</p>
      {names && <p className="type-eyebrow text-text-secondary">{names}</p>}
    </div>
  );
}

function StreamPlayer({
  message,
  stream,
  title,
}: {
  message: string | null;
  stream: LiveStream;
  title: string;
}) {
  if (stream.youtubeVideoId) {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      playsinline: "1",
      rel: "0",
    });
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-stroke-primary bg-black">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${stream.youtubeVideoId}?${params.toString()}`}
          title={title}
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video w-full flex-col justify-end overflow-hidden border border-stroke-primary bg-neutral-800">
      <ImageTreatment
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-70"
        color="purple"
        flicker
        glitchPattern="p1"
        intensity={30}
        lighting="even"
        motion
        objectFit="cover"
        src="/img/subpage-heroes/schedule-hero.webp"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
      />
      <div className="relative flex flex-col gap-3xs p-xs md:p-s">
        <p className="type-eyebrow text-white">{title}</p>
        {message && (
          <p className="type-paragraph max-w-[520px] text-text-secondary">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default function LiveEventSections({
  initialItems,
  initialNow,
  stream,
}: LiveEventSectionsProps) {
  const t = useTranslations("breakpoint.live");
  const tNav = useTranslations("breakpoint.navigation");
  const locale = useLocale();
  const { schedule } = useLiveSchedule(initialItems, initialNow);

  const stages = useMemo(
    () => stagesInSchedule(schedule.sessions, stream.stage),
    [schedule.sessions, stream.stage],
  );
  const [chosenStage, setChosenStage] = useState<string | null>(null);
  const activeStage =
    chosenStage && stages.includes(chosenStage)
      ? chosenStage
      : (stages[0] ?? stream.stage);

  const streamSessions = schedule.sessions.filter(
    (session) => session.location === stream.stage,
  );
  const streamCurrent =
    streamSessions.find((session) => session.status === "live") ?? null;
  const streamNext =
    streamSessions.find(
      (session) => session.status === "next" || session.status === "later",
    ) ?? null;

  const dateLabel = useMemo(() => {
    const [year, month, day] = schedule.date.split("-").map(Number);
    if (!year || !month || !day) return schedule.date;
    // The event is in London, so English dates read day-first.
    const dateLocale = locale === "en" ? "en-GB" : locale;
    return new Intl.DateTimeFormat(dateLocale, {
      day: "numeric",
      month: "long",
      timeZone: EVENT_TIME_ZONE,
    }).format(new Date(Date.UTC(year, month - 1, day, 12)));
  }, [locale, schedule.date]);

  const streamTitle = t("streamTitle", { stage: stream.stage });
  let streamMessage: string | null = null;
  if (!schedule.day) {
    streamMessage = t("noSessionsToday");
  } else if (streamCurrent) {
    streamMessage = null;
  } else if (streamNext) {
    streamMessage = t("streamStartsAt", {
      stage: stream.stage,
      time: formatMinutes(streamNext.startMinutes),
    });
  } else if (streamSessions.length > 0) {
    streamMessage = t("streamEnded", { stage: stream.stage });
  } else {
    streamMessage = t("streamUnavailable", { stage: stream.stage });
  }

  const stageSessions = sessionsForStage(schedule.sessions, activeStage);
  const endedCount = stageSessions.filter(
    (session) => session.status === "ended",
  ).length;
  const upcoming = stageSessions
    .filter((session) => session.status !== "ended")
    .slice(0, UPCOMING_ROW_LIMIT);

  return (
    <>
      <section className="relative overflow-hidden bg-black">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
        >
          <ImageTreatment
            alt=""
            aria-hidden="true"
            className="absolute inset-y-0 right-0 h-full w-[1440px] max-w-none md:inset-0 md:w-full"
            color="purple"
            flicker
            glitchPattern="p1"
            intensity={40}
            lighting="even"
            motion
            mouseReactive
            objectFit="cover"
            src="/assets/home-hero.webp"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black"
          />
        </div>
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[160px] h-[200px] w-[1078px] max-w-none object-cover md:left-0 md:right-auto md:w-full md:min-w-[840px]"
          height={146}
          src={publicAssetPath("/assets/pixel-edge.svg")}
          width={1440}
        />

        <div className="container relative grid grid-cols-1 gap-y-l pb-xl pt-[180px] md:grid-cols-bp-desktop md:grid-rows-[auto_1fr] md:gap-x-s md:gap-y-l md:pt-[220px]">
          <div className="flex flex-col gap-s md:col-span-6 md:row-start-1">
            <p className="type-eyebrow flex items-center gap-2xs text-white">
              <LiveDot />
              {t("eyebrow")}
            </p>
            <h1 className="type-h1 whitespace-pre-line text-white">
              {t("headline")}
            </h1>
            {schedule.day && (
              <p className="type-eyebrow text-text-secondary">
                {t("dayTitle", { day: schedule.day, date: dateLabel })}
              </p>
            )}
          </div>

          <div className="md:col-span-10 md:col-start-7 md:row-span-2 md:row-start-1">
            <StreamPlayer
              message={streamMessage}
              stream={stream}
              title={streamTitle}
            />
          </div>

          <div className="flex flex-col gap-s md:col-span-6 md:col-start-1 md:row-start-2">
            {(streamCurrent || streamNext) && (
              <div className="flex flex-col gap-s">
                {streamCurrent && (
                  <SessionCard
                    label={t("nowOn", { stage: stream.stage })}
                    session={streamCurrent}
                    status="live"
                  />
                )}
                {streamNext && (
                  <SessionCard
                    label={t("nextOn", { stage: stream.stage })}
                    session={streamNext}
                    status="next"
                  />
                )}
              </div>
            )}

            <div className="flex flex-col items-start gap-xs sm:flex-row sm:items-center">
              <Button
                arrow
                href="/schedule"
                label={t("agendaCta")}
                variant="secondary"
              />
              <Button
                arrow
                arrowDirection="down"
                href="#venue-map"
                label={t("mapCta")}
                variant="inline"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="today" className="pt-20 md:pt-[120px]">
        <div className="container flex flex-col gap-m md:gap-l">
          <div className="flex flex-col gap-s md:flex-row md:items-end md:justify-between">
            <SectionHeadline
              eyebrow={t("agenda.eyebrow")}
              headline={t("agenda.headline")}
            />
            <p className="type-eyebrow text-text-secondary">
              {t("agenda.timezoneNote")}
            </p>
          </div>

          {stages.length > 1 && (
            <div
              aria-label={t("agenda.stages")}
              className="flex flex-wrap gap-3xs"
              role="tablist"
            >
              {stages.map((stage) => {
                const active = stage === activeStage;
                return (
                  <button
                    key={stage}
                    aria-selected={active}
                    className={`h-10 border px-xs transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      active
                        ? "border-white bg-white text-black"
                        : "border-stroke-primary text-white hover:border-neutral-500 hover:bg-neutral-800"
                    }`}
                    onClick={() => setChosenStage(stage)}
                    role="tab"
                    type="button"
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col border-t border-neutral-700">
            {endedCount > 0 && (
              <p className="type-eyebrow border-b border-neutral-700 py-2xs text-neutral-500">
                {t("endedCount", { count: endedCount, stage: activeStage })}
              </p>
            )}
            {upcoming.length === 0 && (
              <p className="type-paragraph border-b border-neutral-700 py-s text-text-secondary">
                {schedule.day
                  ? t("agenda.empty", { stage: activeStage })
                  : t("noSessionsToday")}
              </p>
            )}
            {upcoming.map((session) => {
              const names = speakerNames(session);
              return (
                <article
                  key={session.id}
                  className={`grid grid-cols-1 gap-xs border-b border-neutral-700 py-xs md:grid-cols-[180px_minmax(0,1fr)] md:gap-l md:py-s ${
                    session.status === "live" ? "bg-neutral-800/60 md:px-s" : ""
                  }`}
                >
                  <div className="flex flex-row items-center gap-2xs md:flex-col md:items-start md:gap-3xs">
                    <p
                      className={`type-eyebrow flex items-center gap-2xs ${STATUS_CLASSES[session.status]}`}
                    >
                      {session.status === "live" && <LiveDot />}
                      {t(`status.${session.status}`)}
                    </p>
                    <p className="type-eyebrow text-white">
                      {sessionTimeRange(session)}
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-col gap-3xs">
                    <h3 className="type-h5 text-white">{session.title}</h3>
                    {(names || session.tag) && (
                      <p className="type-eyebrow text-text-secondary">
                        {[names, session.tag].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div>
            <Button
              arrow
              href="/schedule"
              label={t("agenda.fullAgenda")}
              variant="primary"
            />
            <span className="sr-only">{tNav("agenda")}</span>
          </div>
        </div>
      </section>
    </>
  );
}
