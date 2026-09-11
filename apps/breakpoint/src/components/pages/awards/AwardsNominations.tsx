"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import { publicAssetPath } from "@/config";
import { awardCategories } from "@/content/awards";

type Nomination = { handle: string; submittedAt: string };
type CampaignStatus = "open" | "not_started" | "closed";

function normaliseHandle(value: string) {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export default function AwardsNominations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nominations, setNominations] = useState<Record<string, Nomination>>(
    {},
  );
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>();
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const activeCategory = awardCategories[activeIndex]!;
  const nominationCount = Object.keys(nominations).length;
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const accentTextClassName =
    activeCategory.section === "Individual"
      ? "text-core-purple"
      : "text-core-green";
  const accentBackgroundClassName =
    activeCategory.section === "Individual"
      ? "bg-core-purple"
      : "bg-core-green";

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/breakpoint/api/nominations", {
          credentials: "same-origin",
        });
        if (!response.ok) throw new Error("Unable to load nominations");
        const data = (await response.json()) as {
          nominations: Array<{
            category: string;
            twitterHandle: string;
            submittedAt: string;
          }>;
          campaignStatus: CampaignStatus;
        };
        const persisted = Object.fromEntries(
          data.nominations.map((nomination) => [
            nomination.category,
            {
              handle: nomination.twitterHandle,
              submittedAt: nomination.submittedAt,
            },
          ]),
        ) as Record<string, Nomination>;
        if (!cancelled) {
          setNominations(persisted);
          setCampaignStatus(data.campaignStatus);
          setSessionReady(true);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to prepare your nominations. Please refresh the page.",
          );
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setHandle(nominations[activeCategory.id]?.handle.replace(/^@/, "") ?? "");
    setError("");
    setEditing(false);
  }, [activeCategory.id, nominations]);

  const categoriesBySection = useMemo(
    () => ["Individual", "Community"] as const,
    [],
  );

  const saveNomination = async () => {
    const normalized = normaliseHandle(handle);
    if (!/^[a-z0-9_]{1,15}$/i.test(normalized)) {
      setError(
        "Enter a valid X username (up to 15 letters, numbers, or underscores).",
      );
      return;
    }
    if (!sessionReady) {
      setError("Preparing your nominations. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/breakpoint/api/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: activeCategory.id,
          twitterHandle: normalized,
          website,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        nomination?: {
          category: string;
          twitterHandle: string;
          submittedAt: string;
        };
      };
      if (!response.ok || !data.nomination) {
        setError(data.error ?? "Unable to save nomination. Please try again.");
        return;
      }
      const next = {
        ...nominations,
        [data.nomination.category]: {
          handle: data.nomination.twitterHandle,
          submittedAt: data.nomination.submittedAt,
        },
      };
      setNominations(next);
      setEditing(false);
    } catch {
      setError("Unable to save nomination. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nomination = nominations[activeCategory.id];
  const share = () => {
    const text = `I nominated ${nomination?.handle} for ${activeCategory.name} at @SolanaConf. 🏆`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section
      className="bg-black pb-3xl pt-2xl md:pb-4xl md:pt-3xl"
      aria-labelledby="nominations-title"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <header className="grid gap-m border-t border-stroke-primary pt-m md:grid-cols-bp-desktop md:gap-x-s md:pt-l">
          <p className="type-eyebrow text-core-green md:col-span-4">
            Community Spotlights
          </p>
          <div className="md:col-span-9 md:col-start-7">
            <h2 className="type-h3 max-w-[780px]" id="nominations-title">
              Your nominations put the ecosystem&apos;s best work in the
              spotlight.
            </h2>
            <p className="mt-s max-w-[620px] text-p-large text-text-secondary">
              Choose a category and enter an X username. You can submit one
              nomination in every category and update it at any time.
            </p>
          </div>
        </header>

        <div className="mt-2xl grid gap-l md:mt-3xl md:grid-cols-bp-desktop md:gap-x-s">
          <aside className="md:col-span-5 md:sticky md:top-[88px] md:h-fit">
            <div className="flex items-end justify-between border-y border-stroke-primary py-s">
              <div>
                <p className="type-eyebrow text-white">Your nominations</p>
                <p className="mt-2xs text-paragraph text-text-secondary">
                  {nominationCount} of {awardCategories.length} nominated
                </p>
              </div>
              <span className="font-bp26 text-h3 text-white" aria-hidden="true">
                {String(nominationCount).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-s md:hidden">
              <label
                className="mb-2xs block font-mono text-button-small uppercase text-text-secondary"
                htmlFor="award-category"
              >
                Choose category
              </label>
              <div className="relative border border-stroke-tertiary bg-black">
                <select
                  className="h-12 w-full appearance-none bg-transparent px-4 pr-12 font-mono text-button-small uppercase text-white outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-core-green"
                  id="award-category"
                  onChange={(event) =>
                    setActiveIndex(Number(event.target.value))
                  }
                  value={activeIndex}
                >
                  {awardCategories.map((category, index) => (
                    <option key={category.id} value={index}>
                      {String(index + 1).padStart(2, "0")} — {category.name}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-white"
                >
                  ↓
                </span>
              </div>
            </div>

            <nav className="mt-m hidden md:block" aria-label="Award categories">
              {categoriesBySection.map((section) => (
                <div className="mb-l last:mb-0" key={section}>
                  <p className="mb-2xs font-mono text-button-small uppercase text-text-secondary">
                    {section}
                  </p>
                  <ul
                    className="unstyled-list border-t border-stroke-primary"
                    aria-label={section}
                  >
                    {awardCategories
                      .filter((category) => category.section === section)
                      .map((category) => {
                        const index = awardCategories.indexOf(category);
                        const selected = index === activeIndex;
                        return (
                          <li key={category.id}>
                            <button
                              aria-current={selected ? "step" : undefined}
                              className={`group flex w-full items-center gap-s border-b border-stroke-primary px-2xs py-2xs text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-green ${selected ? "bg-white text-black" : "text-text-secondary hover:bg-neutral-800 hover:text-white"}`}
                              onClick={() => setActiveIndex(index)}
                              type="button"
                            >
                              <span className="w-m shrink-0 font-mono text-button-small">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="flex-1 text-sm leading-tight">
                                {category.name}
                              </span>
                              {nominations[category.id] && (
                                <span
                                  aria-label="Nominated"
                                  className={
                                    selected ? "text-black" : "text-core-green"
                                  }
                                >
                                  ✓
                                </span>
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
            <article className="overflow-hidden border border-stroke-primary bg-background-secondary">
              <div className={`${accentBackgroundClassName} h-2 w-full`} />
              <div className="relative min-h-[320px] overflow-hidden p-s md:min-h-[400px] md:p-l">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-2 -top-6 font-bp26 text-[128px] leading-none opacity-10 md:right-m md:top-0 md:text-[220px] ${accentTextClassName}`}
                >
                  {activeNumber}
                </span>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center gap-2xs">
                    <span
                      className={`font-mono text-button-small uppercase ${accentTextClassName}`}
                    >
                      {activeNumber} /{" "}
                      {String(awardCategories.length).padStart(2, "0")}
                    </span>
                    <span className="text-text-secondary" aria-hidden="true">
                      —
                    </span>
                    <span className="font-mono text-button-small uppercase text-text-secondary">
                      {activeCategory.section}
                    </span>
                  </div>
                  <h3 className="type-h3 mt-s max-w-[720px] pr-l">
                    {activeCategory.name}
                  </h3>
                  <p className="mt-s max-w-[560px] text-p-large text-text-secondary">
                    {activeCategory.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-stroke-primary p-s md:p-l">
                {campaignStatus && campaignStatus !== "open" ? (
                  <p className="text-p-large text-text-secondary" role="status">
                    {campaignStatus === "closed"
                      ? "Nominations are now closed. Thank you for taking part."
                      : "Nominations have not opened yet. Please check back soon."}
                  </p>
                ) : null}
                {nomination && !editing ? (
                  <div
                    className={`${accentBackgroundClassName} p-s text-black md:p-m`}
                  >
                    <div className="flex flex-col justify-between gap-m md:flex-row md:items-end">
                      <div>
                        <p className="font-mono text-button-small uppercase">
                          Nomination submitted
                        </p>
                        <p className="type-h4 mt-2xs">{nomination.handle}</p>
                      </div>
                      <div className="flex flex-col gap-3 lg:flex-row">
                        <Button
                          iconLeft={
                            <img
                              src={publicAssetPath("/assets/icon-x.svg")}
                              alt=""
                              aria-hidden="true"
                              className="block size-4 brightness-0 invert"
                            />
                          }
                          label="Share Nomination"
                          onClick={share}
                          variant="secondary"
                          className="border-black text-black hover:bg-black hover:text-white"
                        />
                        <Button
                          label="Change nomination"
                          onClick={() => {
                            setHandle(nomination.handle.slice(1));
                            setEditing(true);
                          }}
                          variant="secondary"
                          className="border-black text-black hover:bg-black hover:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : campaignStatus === "open" ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      saveNomination();
                    }}
                  >
                    <div className="flex flex-col gap-s md:flex-row md:items-end md:justify-between">
                      <input
                        aria-hidden="true"
                        autoComplete="off"
                        className="sr-only"
                        name="website"
                        onChange={(event) => setWebsite(event.target.value)}
                        tabIndex={-1}
                        type="text"
                        value={website}
                      />
                      <div className="w-full md:max-w-[520px]">
                        <label
                          className="mb-2xs block font-mono text-button-small uppercase"
                          htmlFor="x-handle"
                        >
                          Nominee&apos;s X username
                        </label>
                        <div className="flex h-12 items-center border border-stroke-tertiary bg-black px-4 focus-within:outline focus-within:outline-1 focus-within:outline-offset-4 focus-within:outline-core-green">
                          <span
                            aria-hidden="true"
                            className="text-text-secondary"
                          >
                            @
                          </span>
                          <input
                            autoComplete="off"
                            className="h-full w-full bg-transparent px-1 text-white outline-none placeholder:text-neutral-500"
                            id="x-handle"
                            maxLength={15}
                            onChange={(event) => setHandle(event.target.value)}
                            placeholder="username"
                            value={handle}
                          />
                        </div>
                      </div>
                      <Button
                        className="w-full md:w-auto"
                        disabled={
                          submitting ||
                          !sessionReady ||
                          campaignStatus !== "open"
                        }
                        label={submitting ? "Submitting…" : "Submit nomination"}
                        type="submit"
                      />
                    </div>
                    {error && (
                      <p className="mt-3 text-sm text-core-pink" role="alert">
                        {error}
                      </p>
                    )}
                  </form>
                ) : null}
              </div>
            </article>
            <div className="mt-m grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-stroke-primary pb-m">
              <Button
                className="justify-self-start"
                label="Previous"
                onClick={() =>
                  setActiveIndex((index) => Math.max(0, index - 1))
                }
                variant="secondary"
                disabled={activeIndex === 0}
              />
              <p
                className="font-mono text-button-small text-text-secondary"
                aria-live="polite"
              >
                {activeNumber} /{" "}
                {String(awardCategories.length).padStart(2, "0")}
              </p>
              <Button
                className="justify-self-end"
                label="Next"
                onClick={() =>
                  setActiveIndex((index) =>
                    Math.min(awardCategories.length - 1, index + 1),
                  )
                }
                variant="secondary"
                disabled={activeIndex === awardCategories.length - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
