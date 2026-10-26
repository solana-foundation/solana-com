"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "@boxicons/react/CheckCircle";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import { publicAssetPath } from "@/config";
import { awardCategories, type AwardCategory } from "@/content/awards";
import type { FinalistCategory } from "@/content/awards-finalists";
import type { AwardsVotingStatus } from "@/lib/awards-campaign";

type Vote = { category: string; twitterHandle: string; submittedAt: string };
type CategoryCopy = { name: string; description: string };

export default function AwardsVoting({
  finalists,
  initialStatus,
}: {
  finalists: FinalistCategory[] | null;
  initialStatus: AwardsVotingStatus;
}) {
  const t = useTranslations("breakpoint.awards");
  const [activeIndex, setActiveIndex] = useState(0);
  const [openSection, setOpenSection] = useState<AwardCategory["section"]>(
    awardCategories[0]!.section,
  );
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [selection, setSelection] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [sessionReady, setSessionReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const category = awardCategories[activeIndex]!;
  const copy = t.raw(`categories.${category.id}`) as CategoryCopy;
  const finalistList =
    finalists?.find((entry) => entry.categoryId === category.id)?.finalists ??
    [];
  const vote = votes[category.id];
  const voteCount = Object.keys(votes).length;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/breakpoint/api/votes", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!response.ok) throw new Error();
        const data = (await response.json()) as {
          votes: Vote[];
          votingStatus: AwardsVotingStatus;
        };
        if (cancelled) return;
        setVotes(
          Object.fromEntries(data.votes.map((item) => [item.category, item])),
        );
        setStatus(data.votingStatus);
        setSessionReady(true);
      } catch {
        if (!cancelled) setLoadFailed(true);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    setSelection("");
    setError("");
    setOpenSection(category.section);
  }, [category.id, category.section]);

  const submit = async () => {
    if (!selection || submitting || !sessionReady || status !== "open" || vote)
      return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/breakpoint/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          categoryId: category.id,
          twitterHandle: selection,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        vote?: Vote;
        error?: string;
      } | null;
      if (response.status === 409 && data?.vote) {
        setVotes((current) => ({
          ...current,
          [data.vote!.category]: data.vote!,
        }));
        setError(t("voting.errors.alreadyVoted"));
      } else if (!response.ok || !data?.vote) {
        setError(data?.error ?? t("voting.errors.save"));
      } else {
        setVotes((current) => ({
          ...current,
          [data.vote!.category]: data.vote!,
        }));
      }
    } catch {
      setError(t("voting.errors.save"));
    } finally {
      setSubmitting(false);
    }
  };

  const share = () => {
    const finalist = finalistList.find(
      (item) => item.twitterHandle === vote?.twitterHandle,
    );
    const text = t("voting.shareText", {
      name: finalist?.name ?? vote?.twitterHandle ?? "",
      category: copy.name,
    });
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section
      aria-labelledby="voting-title"
      className="bg-black pb-3xl pt-2xl md:pb-4xl md:pt-3xl"
      id="voting"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <header className="grid gap-m border-t border-stroke-primary pt-m md:grid-cols-bp-desktop md:gap-x-s md:pt-l">
          <div className="flex flex-col items-start gap-xs md:col-span-4">
            <p className="type-eyebrow text-core-purple">
              {t("voting.eyebrow")}
            </p>
            <div className="flex flex-wrap items-center gap-x-3xs gap-y-3xs">
              <p className="type-caption text-text-secondary">
                {t("nominations.presentedBy")}
              </p>
              <a
                className="focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-purple"
                href="https://satrush.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  alt="SatRush"
                  className="block h-auto w-[120px] max-w-full lg:w-[150px]"
                  height={106}
                  src={publicAssetPath("/assets/satrush-logo-white.svg")}
                  width={478}
                />
              </a>
            </div>
          </div>
          <div className="md:col-span-9 md:col-start-7">
            <h2 className="type-h3 max-w-[780px]" id="voting-title">
              {t("voting.headline")}
            </h2>
            <p className="mt-s max-w-[620px] text-p-large text-text-secondary">
              {t("voting.description")}
            </p>
            <p
              className="mt-s font-mono text-button-small text-core-purple"
              role="status"
            >
              {status === "closed"
                ? t("voting.status.closed")
                : !finalists
                  ? t("voting.status.finalistsPending")
                  : status === "not_started"
                    ? t("voting.status.notStarted")
                    : t("voting.status.open")}
            </p>
            {loadFailed && (
              <p className="mt-s text-sm text-core-pink" role="alert">
                {t("voting.errors.load")}
              </p>
            )}
          </div>
        </header>

        {finalists && (
          <div className="mt-xl grid gap-l md:grid-cols-bp-desktop md:gap-x-s">
            <aside className="md:col-span-5">
              <p
                className="font-mono text-button-small uppercase text-text-secondary"
                aria-live="polite"
              >
                {t("voting.progress", {
                  count: voteCount,
                  total: awardCategories.length,
                })}
              </p>
              <nav
                aria-label={t("nominations.categoryNavigation")}
                className="mt-s"
              >
                {(["individual", "community"] as const).map((section) => (
                  <div key={section}>
                    <button
                      aria-controls={`vote-category-section-${section}`}
                      aria-expanded={openSection === section}
                      className="flex h-12 w-full items-center justify-between border-y border-stroke-primary px-2xs font-mono text-button-small uppercase text-core-purple hover:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-purple"
                      onClick={() => setOpenSection(section)}
                      type="button"
                    >
                      {t(`nominations.sections.${section}`)}
                      <span aria-hidden="true">
                        {openSection === section ? "−" : "+"}
                      </span>
                    </button>
                    <ul
                      aria-label={t(`nominations.sections.${section}`)}
                      className={`unstyled-list ${openSection === section ? "" : "hidden"}`}
                      id={`vote-category-section-${section}`}
                    >
                      {awardCategories
                        .filter((item) => item.section === section)
                        .map((item) => {
                          const index = awardCategories.indexOf(item);
                          const selected = activeIndex === index;
                          const name = (
                            t.raw(`categories.${item.id}`) as CategoryCopy
                          ).name;
                          return (
                            <li key={item.id}>
                              <button
                                aria-current={selected ? "step" : undefined}
                                className={`flex w-full items-center gap-s border-b border-stroke-primary px-2xs py-2xs text-left text-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-purple ${selected ? "bg-white text-black" : "text-text-secondary hover:bg-neutral-800 hover:text-white"}`}
                                onClick={() => setActiveIndex(index)}
                                type="button"
                              >
                                <span className="w-m shrink-0 font-mono text-button-small">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="flex-1">{name}</span>
                                {votes[item.id] && (
                                  <CheckCircle
                                    aria-label={t("voting.voted")}
                                    className={
                                      selected
                                        ? "text-black"
                                        : "text-core-purple"
                                    }
                                    pack="filled"
                                    role="img"
                                  />
                                )}
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
            <div className="md:col-span-10 md:col-start-7">
              <article className="flex h-[642px] flex-col overflow-hidden border border-stroke-primary bg-background-secondary md:h-[634px]">
                <div className="h-2 shrink-0 bg-core-purple" />
                <div className="h-[320px] shrink-0 overflow-y-auto p-s md:px-l md:py-m">
                  <p className="font-mono text-button-small uppercase text-core-purple">
                    {activeIndex + 1} / {awardCategories.length}
                  </p>
                  <h3 className="type-h3 mt-s">{copy.name}</h3>
                  <p className="mt-s text-p-large text-text-secondary">
                    {copy.description}
                  </p>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto border-t border-stroke-primary p-3xs md:px-l md:py-xs">
                  {vote ? (
                    <div
                      className="bg-core-purple p-s text-black"
                      role="status"
                    >
                      <p className="font-mono text-button-small uppercase">
                        {t("voting.submitted")}
                      </p>
                      <p className="type-h4 mt-2xs">
                        {finalistList.find(
                          (item) => item.twitterHandle === vote.twitterHandle,
                        )?.name ?? vote.twitterHandle}
                      </p>
                      <p className="mt-2xs text-sm">{t("voting.finalVote")}</p>
                      <Button
                        className="mt-s border-black text-black hover:bg-black hover:text-white"
                        label={t("voting.share")}
                        onClick={share}
                        variant="secondary"
                      />
                    </div>
                  ) : (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        void submit();
                      }}
                    >
                      <fieldset disabled={submitting || status !== "open"}>
                        <legend className="font-mono text-button-small uppercase text-text-secondary">
                          {t("voting.chooseFinalist")}
                        </legend>
                        <div className="mt-3xs grid grid-cols-1 gap-4xs md:mt-xs md:grid-cols-2 md:gap-2xs">
                          {finalistList.map((finalist) => (
                            <label
                              className={`flex min-w-0 cursor-pointer items-center gap-3xs border p-4xs focus-within:border-core-purple focus-within:outline-none md:gap-2xs md:p-2xs ${selection === finalist.twitterHandle ? "border-core-purple bg-neutral-800" : "border-stroke-primary hover:bg-neutral-800"}`}
                              key={finalist.twitterHandle}
                            >
                              <input
                                checked={selection === finalist.twitterHandle}
                                className="accent-core-purple focus-visible:outline-none"
                                name="finalist"
                                onChange={() =>
                                  setSelection(finalist.twitterHandle)
                                }
                                type="radio"
                                value={finalist.twitterHandle}
                              />
                              <img
                                alt=""
                                className="size-10 shrink-0 rounded-full object-cover md:size-12"
                                height={48}
                                loading="lazy"
                                src={publicAssetPath(finalist.profileImage)}
                                width={48}
                              />
                              <span className="min-w-0">
                                <span className="block font-bold">
                                  {finalist.name}
                                </span>
                                <span className="block text-sm text-text-secondary">
                                  {finalist.twitterHandle}
                                </span>
                                {finalist.description && (
                                  <span className="mt-2xs block text-sm text-text-secondary">
                                    {finalist.description}
                                  </span>
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                        <Button
                          className="mt-3xs md:mt-xs"
                          disabled={
                            !selection ||
                            !sessionReady ||
                            submitting ||
                            status !== "open"
                          }
                          label={
                            submitting
                              ? t("voting.submitting")
                              : t("voting.submit")
                          }
                          type="submit"
                        />
                      </fieldset>
                    </form>
                  )}
                  {error && (
                    <p className="mt-s text-sm text-core-pink" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              </article>
              <div className="mt-m flex items-center justify-between gap-s border-b border-stroke-primary pb-m">
                <Button
                  disabled={activeIndex === 0}
                  label={t("nominations.previous")}
                  onClick={() =>
                    setActiveIndex((index) => Math.max(0, index - 1))
                  }
                  variant="secondary"
                />
                <span
                  aria-live="polite"
                  className="font-mono text-button-small text-text-secondary"
                >
                  {activeIndex + 1} / {awardCategories.length}
                </span>
                <Button
                  disabled={activeIndex === awardCategories.length - 1}
                  label={t("nominations.next")}
                  onClick={() =>
                    setActiveIndex((index) =>
                      Math.min(awardCategories.length - 1, index + 1),
                    )
                  }
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
