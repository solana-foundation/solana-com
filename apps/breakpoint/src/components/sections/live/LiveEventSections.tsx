"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import ImageTreatment from "@/components/ImageTreatment";
import SectionHeadline from "@/components/SectionHeadline";
import { publicAssetPath } from "@/config";
import { stageFloor } from "@/content/agenda/types";
import type { LiveStream } from "@/content/live/streams";
import { VENUE_MAP } from "@/content/venue/map-data";
import {
  followHashLink,
  parseTodayHash,
  scrollToAnchor,
  stageSlug,
  TODAY_ANCHOR,
  venueMapHash,
  VENUE_MAP_ANCHOR,
  zoneForStage,
} from "@/lib/live-links";
import {
  EVENT_TIME_ZONE,
  formatMinutes,
  sessionsForStage,
  sessionsAroundTime,
  stagesInSchedule,
  type LiveSession,
} from "@/lib/live-sessions";
import {
  formatOffsetDuration,
  viewerTimes,
  type ViewerTimes,
} from "@/lib/viewer-time";
import { useRequiredLiveSchedule } from "./LiveScheduleProvider";

const UPCOMING_ROW_LIMIT = 8;

type LiveEventSectionsProps = {
  /** Rendered full width between the hero and today's sessions. */
  belowHero?: ReactNode;
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

/** London time range, with the viewer's own range underneath when it differs. */
function SessionTimes({
  className = "",
  session,
  viewer,
}: {
  className?: string;
  session: LiveSession;
  viewer: ViewerTimes | null;
}) {
  const t = useTranslations("breakpoint.live");
  return (
    <>
      <p className={`type-eyebrow ${className}`.trim()}>
        {sessionTimeRange(session)}
      </p>
      {viewer?.showLocal && (
        <p className="type-eyebrow text-text-secondary">
          {t("localRange", {
            range: viewer.range(session.startMinutes, session.endMinutes),
            zone: viewer.zoneName,
          })}
        </p>
      )}
    </>
  );
}

const YOUTUBE_ORIGIN = "https://www.youtube.com";
const STREAM_STALL_TIMEOUT_MS = 10_000;
/**
 * YouTube's "playing" state. Buffering (3) is not proof of playback: a player
 * stuck behind the bot check reports it once and never starts.
 */
const YOUTUBE_STATE_PLAYING = 1;

/**
 * True when the embedded player has not started playing shortly after it was
 * opened. YouTube's "Sign in to confirm you're not a bot" check raises no
 * player error; the player just stays unstarted, so this is the only signal.
 */
function useStreamStalled(active: boolean) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [stalled, setStalled] = useState(false);
  useEffect(() => {
    if (!active) return;
    let heard = false;
    let playing = false;
    // The player only reports state after it is told someone is listening.
    const handshake = window.setInterval(() => {
      if (heard) return window.clearInterval(handshake);
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
        YOUTUBE_ORIGIN,
      );
    }, 500);
    const timer = window.setTimeout(() => {
      if (!playing) setStalled(true);
    }, STREAM_STALL_TIMEOUT_MS);
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== YOUTUBE_ORIGIN ||
        event.source !== iframeRef.current?.contentWindow
      ) {
        return;
      }
      heard = true;
      let state: unknown;
      try {
        state = JSON.parse(String(event.data))?.info?.playerState;
      } catch {
        return;
      }
      if (state === YOUTUBE_STATE_PLAYING) {
        playing = true;
        setStalled(false);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.clearInterval(handshake);
      window.clearTimeout(timer);
      window.removeEventListener("message", onMessage);
    };
  }, [active]);
  return { iframeRef, stalled };
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
  const [started, setStarted] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const t = useTranslations("breakpoint.live");
  const { iframeRef, stalled } = useStreamStalled(started);
  if (stream.youtubeVideoId) {
    const params = new URLSearchParams({
      autoplay: "1",
      enablejsapi: "1",
      mute: "1",
      playsinline: "1",
      rel: "0",
    });
    // Only read once `started`, which is set by a click, so never on the server.
    if (started) params.set("origin", window.location.origin);
    return (
      <>
        <div className="relative aspect-video w-full overflow-hidden border border-stroke-primary bg-black">
          {started ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              ref={iframeRef}
              referrerPolicy="strict-origin-when-cross-origin"
              // Not youtube-nocookie.com: that host never sees the viewer's
              // YouTube session, so its "Sign in to confirm you're not a bot"
              // check (common on shared venue networks) cannot be passed.
              src={`https://www.youtube.com/embed/${stream.youtubeVideoId}?${params.toString()}`}
              title={title}
            />
          ) : (
            <button
              aria-label={title}
              className="absolute inset-0 flex h-full w-full items-center justify-center text-white"
              onClick={() => setStarted(true)}
              type="button"
            >
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setThumbnailFailed(true)}
                src={
                  thumbnailFailed
                    ? publicAssetPath("/img/subpage-heroes/schedule-hero.webp")
                    : publicAssetPath(`/live/${stream.youtubeVideoId}.jpg`)
                }
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-black/30"
              />
              <svg
                aria-hidden="true"
                className="relative h-20 w-20"
                viewBox="0 0 80 80"
                fill="none"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M32 24L56 40L32 56V24Z" fill="currentColor" />
              </svg>
            </button>
          )}
        </div>
        {/* Kept below the player: YouTube's terms forbid covering any part of it. */}
        <div className="mt-xs flex flex-wrap items-center justify-end gap-x-s gap-y-3xs">
          {stalled && (
            <p className="type-eyebrow text-text-secondary" role="status">
              {t("streamStalled")}
            </p>
          )}
          <Button
            arrow
            href={`https://www.youtube.com/watch?v=${stream.youtubeVideoId}`}
            label={stalled ? t("streamStalledCta") : "YouTube"}
            rel="noopener"
            target="_blank"
            variant={stalled ? "secondary" : "inline"}
          />
        </div>
      </>
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

/** Plain-language note on where the viewer is relative to London. */
function ViewerNote({ viewer }: { viewer: ViewerTimes }) {
  const t = useTranslations("breakpoint.live");
  const locale = useLocale();

  if (!viewer.showLocal) {
    return (
      <p className="type-eyebrow text-text-secondary">
        {t("viewer.same", { place: viewer.place })}
      </p>
    );
  }

  return (
    <p className="type-eyebrow text-text-secondary">
      {t("viewer.offset", {
        difference: formatOffsetDuration(viewer.differenceMinutes, locale),
        direction: viewer.differenceMinutes > 0 ? "ahead" : "behind",
        place: viewer.place,
        zone: viewer.zoneName,
      })}
    </p>
  );
}

export default function LiveEventSections({
  belowHero,
  stream,
}: LiveEventSectionsProps) {
  const t = useTranslations("breakpoint.live");
  const tNav = useTranslations("breakpoint.navigation");
  const tFloors = useTranslations("breakpoint.pages.schedule.list.floors");
  const locale = useLocale();
  const { schedule, now, viewerTimeZone } = useRequiredLiveSchedule();

  const viewer = useMemo(
    () => viewerTimes(schedule.date, viewerTimeZone, locale),
    [locale, schedule.date, viewerTimeZone],
  );

  const stages = useMemo(
    () => stagesInSchedule(schedule.sessions, stream.stage),
    [schedule.sessions, stream.stage],
  );
  const [chosenStage, setChosenStage] = useState<string | null>(null);
  // Stage slug from `#today/<stage>` (the venue map or a shared link). Kept
  // as state so it resolves once the stages arrive; with the preview clock
  // the first render has none.
  const [requestedSlug, setRequestedSlug] = useState<string | null>(null);

  useEffect(() => {
    const apply = () => {
      const slug = parseTodayHash(window.location.hash);
      if (!slug) return;
      setRequestedSlug(slug);
      // A fresh link wins over a tab picked earlier.
      setChosenStage(null);
      scrollToAnchor(TODAY_ANCHOR);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const requestedStage = requestedSlug
    ? (stages.find((candidate) => stageSlug(candidate) === requestedSlug) ??
      null)
    : null;
  const activeStage =
    chosenStage && stages.includes(chosenStage)
      ? chosenStage
      : (requestedStage ?? stages[0] ?? stream.stage);

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
    const time = formatMinutes(streamNext.startMinutes);
    streamMessage = viewer?.showLocal
      ? t("streamStartsAtLocal", {
          localTime: viewer.time(streamNext.startMinutes),
          stage: stream.stage,
          time,
          zone: viewer.zoneName,
        })
      : t("streamStartsAt", { stage: stream.stage, time });
  } else if (streamSessions.length > 0) {
    streamMessage = t("streamEnded", { stage: stream.stage });
  } else {
    streamMessage = t("streamUnavailable", { stage: stream.stage });
  }

  const stageSessions = sessionsAroundTime(
    sessionsForStage(schedule.sessions, activeStage),
    now,
  ).slice(0, UPCOMING_ROW_LIMIT);

  const streamZone = zoneForStage(VENUE_MAP, stream.stage);
  const streamMapHref = streamZone
    ? venueMapHash(streamZone.id)
    : `#${VENUE_MAP_ANCHOR}`;
  const activeZone = zoneForStage(VENUE_MAP, activeStage);
  const activeFloor = stageFloor(activeStage);

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
                href={streamMapHref}
                label={t("mapCta")}
                onClick={() => followHashLink(streamMapHref)}
                variant="inline"
              />
            </div>
          </div>
        </div>
      </section>

      {belowHero}

      <section id={TODAY_ANCHOR} className="pt-20 md:pt-[120px]">
        <div className="container flex flex-col gap-m md:gap-l">
          <div className="flex flex-col gap-s md:flex-row md:items-end md:justify-between">
            <SectionHeadline
              eyebrow={t("agenda.eyebrow")}
              headline={t("agenda.headline")}
            />
            <div className="flex flex-col gap-3xs md:max-w-[420px] md:text-right">
              <p className="type-eyebrow text-text-secondary">
                {t("agenda.timezoneNote")}
              </p>
              {viewer && <ViewerNote viewer={viewer} />}
            </div>
          </div>

          <div className="flex flex-col gap-xs">
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

            {activeZone && (
              <p className="type-eyebrow text-text-secondary">
                {activeFloor && (
                  <>
                    {tFloors(activeFloor)}
                    <span aria-hidden="true"> · </span>
                  </>
                )}
                <a
                  className="text-white underline-offset-4 transition-colors hover:text-text-secondary hover:underline"
                  href={venueMapHash(activeZone.id)}
                  onClick={() => followHashLink(venueMapHash(activeZone.id))}
                >
                  {t("agenda.mapLink", { stage: activeStage })}
                </a>
              </p>
            )}
          </div>

          <div className="flex flex-col border-t border-neutral-700">
            {stageSessions.length === 0 && (
              <p className="type-paragraph border-b border-neutral-700 py-s text-text-secondary">
                {schedule.day
                  ? t("agenda.empty", { stage: activeStage })
                  : t("noSessionsToday")}
              </p>
            )}
            {stageSessions.map((session) => {
              const names = speakerNames(session);
              return (
                <article
                  key={session.id}
                  className="grid grid-cols-1 gap-xs border-b border-neutral-700 py-xs md:grid-cols-[180px_minmax(0,1fr)] md:gap-l md:py-s"
                >
                  <div className="flex flex-row flex-wrap items-center gap-2xs md:flex-col md:items-start md:gap-3xs">
                    <p className="type-eyebrow text-text-secondary">
                      {t("agenda.scheduled")}
                    </p>
                    <SessionTimes
                      className="text-white"
                      session={session}
                      viewer={viewer}
                    />
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
