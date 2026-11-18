import { getTranslations } from "@workspace/i18n/server";
import Button from "@/components/Button";
import NextEditionBar from "@/components/sections/NextEditionBar";
import RecordingButton from "./RecordingButton";
import { BREAKPOINT_RECAP_PLAYLIST_HREF } from "@/content/links";
import { NEXT_EDITION } from "@/content/next-edition";
import { youTubeWatchUrl } from "@/content/agenda/session-videos";
import { getLiveAgenda } from "@/content/live/agenda";
import {
  POST_CONFERENCE_RECORDING,
  selectRecapSessions,
} from "@/content/post-conference";
import { formatEventDateRange } from "@/lib/event-dates";
import { publicAssetPath } from "@/config";

export default async function PostConferenceSection({
  locale,
  showNextEdition,
}: {
  locale: string;
  showNextEdition: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "breakpoint.post" });
  const tList = await getTranslations({
    locale,
    namespace: "breakpoint.pages.schedule.list",
  });
  const sessions = selectRecapSessions(await getLiveAgenda());
  const edition = NEXT_EDITION;
  const dates = formatEventDateRange(
    locale,
    edition.startDate,
    edition.endDate,
  );
  return (
    <>
      <section className="overflow-hidden border-b border-stroke-primary pt-3xl md:pt-4xl">
        <div className="container">
          <p className="type-eyebrow mb-l text-core-purple">
            {showNextEdition
              ? t("eyebrow", { year: edition.year })
              : t("recapEyebrow")}
          </p>
          <div className="grid gap-l pb-xl md:grid-cols-2 md:items-end md:gap-xl md:pb-3xl">
            <div className="flex min-w-0 flex-col items-start gap-m">
              <h1 className="type-h1 text-text-primary">
                {showNextEdition ? (
                  <>
                    {t("headline")}
                    <br />
                    <span className="text-core-purple">
                      {edition.city ?? edition.shortName}.
                    </span>
                  </>
                ) : (
                  t("thanks")
                )}
              </h1>
              <p className="type-p-large max-w-lg text-text-secondary">
                {t("intro")}
              </p>
              {showNextEdition && (
                <p className="type-eyebrow text-text-primary">
                  {[dates, edition.venue].filter(Boolean).join(" · ")}
                </p>
              )}
              <div className="flex flex-wrap gap-xs">
                {showNextEdition && (
                  <Button
                    arrow
                    href={edition.registrationHref}
                    label={t("register", { shortName: edition.shortName })}
                  />
                )}
                <Button
                  arrow
                  arrowDirection="down"
                  variant="secondary"
                  href="#recap"
                  label={t("recapCta")}
                />
              </div>
            </div>
            <div className="relative flex min-h-80 flex-col justify-between overflow-hidden bg-core-purple p-m text-black md:min-h-96 md:p-l">
              <img
                src={publicAssetPath("/assets/home-hero.webp")}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-multiply"
              />
              <p className="type-eyebrow relative">{t("recapEyebrow")}</p>
              <div className="relative mt-3xl flex flex-col items-start gap-s">
                <h2 className="type-h2 max-md:text-h3!">{t("thanks")}</h2>
                <Button
                  arrow
                  arrowDirection="down"
                  href="#recap"
                  label={t("recapCta")}
                />
              </div>
            </div>
          </div>
        </div>
        {showNextEdition && <NextEditionBar announcement={edition} />}
      </section>

      <section
        id="recap"
        aria-labelledby="recap-title"
        className="scroll-mt-xl pt-xl md:pt-3xl"
      >
        <div className="container">
          <div className="mb-l flex flex-col gap-s md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-xs">
              <p className="type-eyebrow text-core-purple">
                {t("recapEyebrow")}
              </p>
              <h2 id="recap-title" className="type-h3">
                {t("recapHeadline")}
              </h2>
            </div>
            <p className="type-paragraph max-w-lg text-text-secondary">
              {t("recapBody")}
            </p>
          </div>
          <div className="grid overflow-hidden border border-stroke-primary md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden bg-background-secondary">
              <img
                src={publicAssetPath(
                  `/live/${POST_CONFERENCE_RECORDING.youtubeVideoId}.jpg`,
                )}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start justify-center gap-m bg-background-secondary p-m md:p-xl">
              <p className="type-eyebrow text-core-purple">
                {t("recapEyebrow")}
              </p>
              <h3 className="type-h3">{t("recordingHeadline")}</h3>
              <RecordingButton
                videoId={POST_CONFERENCE_RECORDING.youtubeVideoId}
                title={t("recordingTitle")}
                label={t("recording")}
              />
              <Button
                variant="inline"
                arrow
                href={BREAKPOINT_RECAP_PLAYLIST_HREF}
                label={t("playlist")}
              />
            </div>
          </div>
          {sessions.length > 0 && (
            <div className="pt-xl">
              <div className="mb-m flex flex-col gap-xs md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-xs">
                  <h3 className="type-h3">{t("sessionsHeadline")}</h3>
                  <p className="type-paragraph text-text-secondary">
                    {t("sessionsBody")}
                  </p>
                </div>
                <Button
                  variant="inline"
                  arrow
                  href="/schedule"
                  label={t("scheduleCta")}
                />
              </div>
              <div className="grid gap-xs md:grid-cols-2">
                {sessions.map((session) => (
                  <details
                    key={session.id}
                    className="group border border-stroke-primary bg-background-secondary open:border-core-purple"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-s p-s focus-visible:outline focus-visible:outline-core-purple [&::-webkit-details-marker]:hidden">
                      <span className="flex flex-col gap-xs">
                        <span className="type-eyebrow text-core-purple">
                          {[
                            session.day,
                            session.location,
                            session.format ?? session.tag,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        <span className="type-h5">{session.title}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="type-h5 text-core-purple group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="flex flex-col gap-xs border-t border-stroke-primary p-s">
                      {session.description && (
                        <p className="type-paragraph text-text-secondary">
                          {session.description}
                        </p>
                      )}
                      {session.speakers.map((speaker) => (
                        <p
                          key={speaker.id ?? speaker.name}
                          className="type-paragraph"
                        >
                          {speaker.name}
                          <span className="text-text-secondary">
                            {speaker.company ? ` · ${speaker.company}` : ""}
                          </span>
                        </p>
                      ))}
                      <p className="type-eyebrow text-text-secondary">
                        {[session.time, session.duration]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {session.youtubeVideoId && (
                        <a
                          href={youTubeWatchUrl(session.youtubeVideoId)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={tList("watchSessionLabel", {
                            title: session.title,
                          })}
                          className="type-eyebrow inline-flex items-center gap-3xs self-start text-core-purple underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          data-agenda-video
                        >
                          <span aria-hidden="true">▶</span>
                          {tList("watchSession")}
                        </a>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
