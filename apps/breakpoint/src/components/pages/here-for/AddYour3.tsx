"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import { handleFromInput } from "@/lib/here-for/handles";
import {
  HERE_FOR_MAX_ADDS,
  type HereForErrorCode,
  type HereForHandle,
} from "@/lib/here-for/types";
import {
  HERE_FOR_PATH,
  consumeSignInReturn,
  handleSlug,
  joinHandles,
  openXIntent,
  personUrl,
  signOutOfX,
  submitAdds,
  useGraphIndex,
  useDirectory,
  useMe,
  withAsk,
  xSignInUrl,
} from "./client";
import { buildCandidates, matchCandidates } from "./typeahead";
import BackToMap from "./BackToMap";
import { hereForType } from "./typography";

const SUGGESTION_COUNT = 6;
const MATCH_COUNT = 5;

type Result = {
  handle: HereForHandle;
  adds: HereForHandle[];
  newMutuals: HereForHandle[];
};

export default function AddYour3({ locale }: { locale: string }) {
  const t = useTranslations("breakpoint.hereFor");
  const [me, setMe] = useMe();
  const { graph } = useGraphIndex(null);

  const [adds, setAdds] = useState<HereForHandle[]>([]);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const prefilled = useRef(false);
  // Picks carried through X sign-in, saved once the session is back.
  const autoSave = useRef(false);

  const closed = me.status === "ready" && me.data.status === "closed";
  const returning = me.status === "ready" && me.data.adds.length > 0;
  const ownHandle = me.status === "ready" ? me.data.xHandle : null;
  // Their saved 3, untouched: nothing to update, so offer the post instead.
  const savedHandle =
    me.status === "ready" &&
    me.data.handle === ownHandle &&
    me.data.adds.length === HERE_FOR_MAX_ADDS &&
    me.data.adds.every((handle, i) => adds[i] === handle) &&
    adds.length === HERE_FOR_MAX_ADDS
      ? me.data.handle
      : null;

  // Prefill from a previous submission, then from ?add= links on the map.
  useEffect(() => {
    if (prefilled.current || me.status === "loading") return;
    prefilled.current = true;
    const existing = me.status === "ready" ? me.data : null;
    const params = new URLSearchParams(window.location.search);
    const x = params.get("x");
    if (x === "denied" || x === "error") setMessage(t(`errors.x_${x}`));
    const carried = (params.get("picks") ?? "")
      .split(",")
      .map(handleFromInput)
      .filter((h): h is HereForHandle => h !== null)
      .filter((h, i, all) => all.indexOf(h) === i)
      .slice(0, HERE_FOR_MAX_ADDS);
    const start = carried.length ? carried : (existing?.adds ?? []);
    // Save only picks carried through a sign-in that just finished; a shared
    // ?picks= link prefills the form and waits for the visitor to confirm.
    autoSave.current =
      carried.length === HERE_FOR_MAX_ADDS &&
      Boolean(existing?.xHandle) &&
      consumeSignInReturn();
    // Keep the URL clean so a reload doesn't replay the sign-in outcome.
    if (params.has("picks") || x) {
      params.delete("picks");
      params.delete("x");
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      );
    }
    const requested = handleFromInput(params.get("add") ?? "");
    if (
      requested &&
      !start.includes(requested) &&
      requested !== existing?.handle
    ) {
      setAdds(
        start.length < HERE_FOR_MAX_ADDS
          ? [...start, requested]
          : [...start.slice(0, 2), requested],
      );
    } else {
      setAdds(start);
    }
  }, [me, t]);

  const suggestions = useMemo(() => {
    const taken = new Set<string>([...adds, ownHandle ?? ""]);
    const addedYou = me.status === "ready" ? me.data.addedBy : [];
    const out: { handle: HereForHandle; why: string }[] = [];
    for (const h of addedYou) {
      if (!taken.has(h)) out.push({ handle: h, why: t("add.addedYou") });
    }
    if (graph.status === "ready") {
      const { payload, ranked } = graph.data;
      for (const node of ranked) {
        if (out.length >= SUGGESTION_COUNT) break;
        const h = payload.handles[node]!;
        if (taken.has(h) || out.some((s) => s.handle === h)) continue;
        out.push({
          handle: h,
          why: t("add.addedCount", { count: payload.inDegree[node] ?? 0 }),
        });
      }
    }
    return out.slice(0, SUGGESTION_COUNT);
  }, [adds, ownHandle, me, graph, t]);

  // Typeahead over the map and the seeded directory, so most picks take a
  // few letters of a name or handle and a tap. Nothing here calls X.
  const [searching, setSearching] = useState(false);
  const directory = useDirectory(searching);
  const candidates = useMemo(
    () =>
      buildCandidates(graph.status === "ready" ? graph.data : null, directory),
    [graph, directory],
  );
  const matches = useMemo(
    () =>
      matchCandidates(
        candidates,
        draft,
        new Set<string>([...adds, ownHandle ?? ""]),
        MATCH_COUNT,
      ),
    [candidates, draft, adds, ownHandle],
  );
  // The highlighted option is what Enter adds; typing resets it to the top.
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [draft]);
  const activeMatch = matches[Math.min(active, matches.length - 1)];

  const addHandle = (value: string) => {
    const next = handleFromInput(value);
    setMessage(null);
    if (!next) return setMessage(t("errors.invalid_handle"));
    if (next === ownHandle) return setMessage(t("errors.self_add"));
    if (adds.includes(next))
      return setMessage(t("errors.duplicate", { handle: next }));
    if (adds.length >= HERE_FOR_MAX_ADDS) return setMessage(t("errors.full"));
    setAdds([...adds, next]);
    setDraft("");
  };

  const ready = adds.length === HERE_FOR_MAX_ADDS && !closed;
  // Until the map loads nobody is known to have added theirs, so keep asking.
  const hasAdded = (handle: HereForHandle) => {
    if (graph.status !== "ready") return false;
    const node = graph.data.byHandle.get(handle);
    return node !== undefined && graph.data.payload.claimed[node] === 1;
  };
  const your3Post = (handles: HereForHandle[]) =>
    withAsk(
      t("share.your3", {
        handles: joinHandles(
          Array.from(
            { length: HERE_FOR_MAX_ADDS },
            (_, i) => handles[i] ?? "@___",
          ),
        ),
      }),
      t("share.ask"),
      !(handles.length === HERE_FOR_MAX_ADDS && handles.every(hasAdded)),
    );
  const postText = your3Post(adds);

  const save = async () => {
    if (adds.length !== HERE_FOR_MAX_ADDS)
      return setMessage(t("errors.invalid_adds"));
    // Signing in is the last step: carry the picks to X and back.
    if (!ownHandle) {
      window.location.href = xSignInUrl(adds);
      return;
    }
    setSaving(true);
    setMessage(null);
    const response = await submitAdds({ adds });
    setSaving(false);
    if (!response.ok) {
      const code: HereForErrorCode = response.error.code ?? "unavailable";
      // The session cookie expired or was cleared: show the sign-in step.
      if (code === "auth_required" && me.status === "ready")
        setMe({ ...me.data, xHandle: null });
      return setMessage(t(`errors.${code}`));
    }
    setMe(response.data.me);
    setResult({
      handle: ownHandle,
      adds,
      newMutuals: response.data.newMutuals,
    });
  };

  // Back from X with three picks: finish the save they started.
  useEffect(() => {
    if (!autoSave.current || !ownHandle || adds.length !== HERE_FOR_MAX_ADDS)
      return;
    autoSave.current = false;
    if (adds.includes(ownHandle)) return setMessage(t("errors.self_add"));
    save();
    // save reads the latest state; it runs once per carried set of picks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownHandle, adds]);

  const step = result ? 2 : adds.length === HERE_FOR_MAX_ADDS ? 1 : 0;
  const steps = ["picks", "handle", "post"] as const;

  return (
    <section className="bg-black pb-3xl pt-[120px] md:pb-4xl md:pt-[136px]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-l px-4 md:grid-cols-bp-desktop md:gap-x-s md:px-8">
        <aside className="flex flex-col gap-l md:col-span-5">
          <div className="flex flex-col gap-xs">
            <BackToMap />
            <p className={`${hereForType.eyebrow} text-core-purple`}>
              {t("add.eyebrow")}
            </p>
            <h1 className="type-h3">{t("add.title")}</h1>
            <p
              className={`max-w-[420px] ${hereForType.body} text-text-secondary`}
            >
              {t("add.description")}
            </p>
          </div>
          {/* Phones go straight to the picker; the form numbers its own steps. */}
          <div className="hidden md:block">
            <p className={`${hereForType.label} mb-xs text-text-secondary`}>
              {t("add.progress", { count: adds.length })}
            </p>
            <ol className="unstyled-list border-t border-stroke-primary">
              {steps.map((key, i) => (
                <li
                  key={key}
                  aria-current={i === step ? "step" : undefined}
                  className={`flex h-10 items-center gap-s border-b border-stroke-primary px-2xs ${hereForType.control} ${
                    i === step
                      ? "bg-white text-black"
                      : i < step
                        ? "text-core-green"
                        : "text-white"
                  }`}
                >
                  <span className="w-m">0{i + 1}</span>
                  {t(`add.steps.${key}`)}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="md:col-span-10 md:col-start-7">
          {result ? (
            <Saved
              locale={locale}
              result={result}
              post={your3Post(result.adds)}
            />
          ) : (
            <form
              className="flex flex-col border-t-[6px] border-core-purple bg-background-secondary"
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
            >
              {closed && (
                <p
                  role="status"
                  className={`border-b border-stroke-primary p-s ${hereForType.lead} text-text-secondary md:px-l`}
                >
                  {t("add.closed")}
                </p>
              )}
              <div className="flex flex-col gap-xs p-s md:px-l md:pt-l">
                <SectionLabel index={1}>{t("add.picksLabel")}</SectionLabel>
                <ol className="unstyled-list grid gap-2xs md:grid-cols-3">
                  {Array.from({ length: HERE_FOR_MAX_ADDS }, (_, i) => {
                    const value = adds[i];
                    return (
                      <li
                        key={i}
                        className={`relative flex min-h-11 items-center gap-xs py-3xs pl-xs pr-xl [container-type:inline-size] md:min-h-[120px] md:flex-col md:justify-center md:p-xs md:text-center ${
                          value
                            ? "border border-core-purple bg-black text-white"
                            : "border border-dashed border-stroke-secondary text-neutral-500"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`${hereForType.caption} md:absolute md:left-2xs md:top-2xs ${value ? "text-core-purple" : ""}`}
                        >
                          0{i + 1}
                        </span>
                        <span
                          className={`min-w-0 break-all font-sans text-lg leading-tight md:text-[clamp(0.875rem,9cqi,1.5rem)] ${value ? "font-bold" : "font-normal"}`}
                        >
                          {value ?? t("add.empty")}
                        </span>
                        {value && !closed && (
                          <button
                            type="button"
                            onClick={() =>
                              setAdds(adds.filter((h) => h !== value))
                            }
                            aria-label={t("add.remove", { handle: value })}
                            className="absolute right-3xs top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-2xl leading-none text-text-secondary transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-core-purple md:top-3xs md:size-8 md:translate-y-0"
                          >
                            ×
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ol>

                {!closed && adds.length < HERE_FOR_MAX_ADDS && (
                  <>
                    <label
                      htmlFor="here-for-add"
                      className={`mt-2xs ${hereForType.label} text-text-secondary`}
                    >
                      {t("add.addLabel")}
                    </label>
                    <div className="flex h-12 items-center gap-3xs border border-stroke-secondary bg-black px-xs focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-core-purple">
                      <span
                        aria-hidden="true"
                        className="font-mono text-neutral-500"
                      >
                        @
                      </span>
                      <input
                        id="here-for-add"
                        type="text"
                        role="combobox"
                        aria-expanded={matches.length > 0}
                        aria-controls="here-for-matches"
                        aria-autocomplete="list"
                        aria-activedescendant={
                          activeMatch
                            ? `here-for-match-${handleSlug(activeMatch.handle)}`
                            : undefined
                        }
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onFocus={() => setSearching(true)}
                        onPaste={(event) => {
                          // A pasted handle or profile link is a complete pick.
                          const text = event.clipboardData.getData("text");
                          if (!handleFromInput(text)) return;
                          event.preventDefault();
                          addHandle(text);
                        }}
                        onKeyDown={(event) => {
                          if (
                            matches.length &&
                            (event.key === "ArrowDown" ||
                              event.key === "ArrowUp")
                          ) {
                            event.preventDefault();
                            const step = event.key === "ArrowDown" ? 1 : -1;
                            setActive(
                              (Math.min(active, matches.length - 1) +
                                step +
                                matches.length) %
                                matches.length,
                            );
                          } else if (event.key === "Enter") {
                            event.preventDefault();
                            addHandle(activeMatch?.handle ?? draft);
                          }
                        }}
                        placeholder={t("add.addPlaceholder")}
                        enterKeyHint="done"
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className={`h-full w-0 min-w-0 flex-1 bg-transparent ${hereForType.input} text-white outline-none placeholder:text-neutral-500`}
                      />
                    </div>
                    {draft.trim() ? (
                      <ul
                        id="here-for-matches"
                        role="listbox"
                        aria-label={t("add.addLabel")}
                        className="unstyled-list flex flex-col border-x border-t border-stroke-primary"
                      >
                        {matches.length === 0 ? (
                          <li
                            className={`border-b border-stroke-primary px-xs py-xs ${hereForType.small} text-text-secondary`}
                          >
                            {t("add.noMatch")}
                          </li>
                        ) : (
                          matches.map(({ handle, name, addedBy }) => (
                            <li key={handle} role="presentation">
                              <button
                                type="button"
                                id={`here-for-match-${handleSlug(handle)}`}
                                role="option"
                                aria-selected={handle === activeMatch?.handle}
                                onClick={() => addHandle(handle)}
                                onMouseEnter={() =>
                                  setActive(
                                    matches.findIndex(
                                      (m) => m.handle === handle,
                                    ),
                                  )
                                }
                                className={`flex h-14 w-full items-center justify-between gap-xs border-b border-stroke-primary px-xs text-left font-sans normal-case tracking-normal transition-colors aria-selected:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple`}
                              >
                                <span className="flex min-w-0 flex-col">
                                  <span
                                    className={`truncate ${hereForType.name}`}
                                  >
                                    {name ?? handle}
                                  </span>
                                  {name && (
                                    <span
                                      className={`truncate ${hereForType.small} text-text-secondary`}
                                    >
                                      {handle}
                                    </span>
                                  )}
                                </span>
                                {(addedBy !== null || !name) && (
                                  <span
                                    className={`shrink-0 ${hereForType.small} text-text-secondary`}
                                  >
                                    {addedBy === null
                                      ? t("add.notOnMap")
                                      : t("add.onMapCount", {
                                          count: addedBy,
                                        })}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : (
                      suggestions.length > 0 && (
                        <>
                          <p
                            className={`mt-2xs ${hereForType.caption} text-text-secondary`}
                          >
                            {me.status === "ready" && me.data.addedBy.length
                              ? t("add.suggestionsNear")
                              : t("add.suggestionsTop")}
                          </p>
                          <ul className="unstyled-list grid gap-2xs sm:grid-cols-2">
                            {suggestions.map((s) => (
                              <li key={s.handle}>
                                <button
                                  type="button"
                                  onClick={() => addHandle(s.handle)}
                                  className="flex h-14 w-full items-center gap-xs border border-stroke-primary px-xs text-left font-sans normal-case tracking-normal transition-colors hover:border-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-purple"
                                >
                                  <span className="flex min-w-0 flex-col">
                                    <span
                                      className={`truncate ${hereForType.name}`}
                                    >
                                      {s.handle}
                                    </span>
                                    <span
                                      className={`truncate ${hereForType.small} text-text-secondary`}
                                    >
                                      {s.why}
                                    </span>
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-s border-t border-stroke-primary p-s md:px-l">
                <div className="flex flex-col gap-3xs">
                  <SectionLabel index={2}>{t("add.postPreview")}</SectionLabel>
                  <p className={`${hereForType.body} text-white`}>{postText}</p>
                </div>
                {ownHandle ? (
                  <div className="flex h-12 items-center justify-between gap-xs border border-stroke-secondary bg-black pl-xs pr-2xs">
                    <span
                      className={`truncate ${hereForType.input} text-white`}
                    >
                      <span className="text-text-secondary">
                        {t("add.savingAs")}{" "}
                      </span>
                      {ownHandle}
                    </span>
                    {!closed && (
                      <button
                        type="button"
                        onClick={async () => {
                          setMessage(null);
                          if (!(await signOutOfX())) {
                            setMessage(t("errors.logout_error"));
                            return;
                          }
                          if (me.status === "ready")
                            setMe({ ...me.data, xHandle: null });
                        }}
                        className={`flex h-8 shrink-0 items-center border border-stroke-secondary px-xs ${hereForType.control} text-text-secondary transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-purple`}
                      >
                        {t("add.signOut")}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className={`${hereForType.small} text-text-secondary`}>
                    {t("add.signInHint")}
                  </p>
                )}
                {savedHandle ? (
                  <Button
                    label={t("add.postYour3")}
                    onClick={() =>
                      openXIntent(postText, personUrl(locale, savedHandle))
                    }
                    className="h-12 md:self-start"
                    arrow
                  />
                ) : (
                  <Button
                    type="submit"
                    label={
                      saving
                        ? t("add.saving")
                        : !ownHandle
                          ? t("add.signInToSave")
                          : returning
                            ? t("add.update")
                            : t("add.save")
                    }
                    disabled={!ready || saving || me.status === "loading"}
                    className="h-12 md:self-start"
                    arrow
                  />
                )}
                {!ownHandle && !closed && adds.length < HERE_FOR_MAX_ADDS && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = xSignInUrl(adds);
                    }}
                    className={`self-start ${hereForType.small} text-text-secondary underline underline-offset-4 hover:text-white`}
                  >
                    {t("add.alreadyAdded")}
                  </button>
                )}
              </div>
              <p
                role="alert"
                aria-live="assertive"
                className={
                  message
                    ? `px-s pb-s ${hereForType.small} text-core-pink md:px-l`
                    : "sr-only"
                }
              >
                {message}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Saved({
  locale,
  result,
  post,
}: {
  locale: string;
  result: Result;
  post: string;
}) {
  const t = useTranslations("breakpoint.hereFor");
  const mutual = result.newMutuals[0];
  const url = personUrl(locale, result.handle);
  return (
    <div
      className={`flex flex-col gap-m border-t-[6px] bg-background-secondary p-s md:p-l ${
        mutual ? "border-core-green" : "border-core-purple"
      }`}
    >
      <div className="flex flex-col gap-xs" role="status">
        <p
          className={`${hereForType.label} ${mutual ? "text-core-green" : "text-core-purple"}`}
        >
          {mutual ? t("add.newMutualEyebrow") : t("add.saved")}
        </p>
        <h2 className="type-h3">
          {mutual
            ? t("add.newMutualTitle", { handle: mutual })
            : joinHandles(result.adds)}
        </h2>
        <p className={`${hereForType.lead} text-text-secondary`}>
          {mutual ? t("add.newMutualDescription") : t("add.savedDescription")}
        </p>
      </div>
      <div className="flex flex-col gap-2xs md:flex-row md:flex-wrap">
        {mutual && (
          <Button
            label={t("add.postMutual")}
            onClick={() =>
              openXIntent(
                t("share.mutual", { handle: mutual }),
                personUrl(locale, result.handle, { with: mutual }),
              )
            }
          />
        )}
        <Button
          label={t("add.postYour3")}
          onClick={() => openXIntent(post, url)}
          variant={mutual ? "secondary" : "primary"}
        />
        <Button
          href={`${HERE_FOR_PATH}/${handleSlug(result.handle)}`}
          label={t("add.openMap")}
          variant="secondary"
          arrow
        />
        <Button
          href={`${HERE_FOR_PATH}/find`}
          label={t("add.findMutuals")}
          variant="secondary"
          arrow
        />
      </div>
    </div>
  );
}

/** A numbered form section label, matching the step list beside the form. */
function SectionLabel({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`flex items-baseline gap-xs ${hereForType.label} text-text-secondary`}
    >
      <span className="text-core-purple">0{index}</span>
      {children}
    </p>
  );
}
