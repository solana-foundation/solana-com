"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import {
  HERE_FOR_MAX_ADDS,
  type HereForErrorCode,
  type HereForHandle,
} from "@/lib/here-for/types";
import {
  HERE_FOR_PATH,
  handleSlug,
  joinHandles,
  openXIntent,
  personUrl,
  signOutOfX,
  submitAdds,
  useGraphIndex,
  useMe,
  withAsk,
  xSignInUrl,
} from "./client";
import BackToMap from "./BackToMap";
import { hereForType } from "./typography";

const HANDLE_PATTERN = /^[a-z0-9_]{1,15}$/;
const SUGGESTION_COUNT = 6;

const toHandle = (value: string) => {
  const slug = handleSlug(value.trim());
  return HANDLE_PATTERN.test(slug) ? (`@${slug}` as HereForHandle) : null;
};

type Result = {
  handle: HereForHandle;
  adds: HereForHandle[];
  newMutuals: HereForHandle[];
};

export default function AddYour3({ locale }: { locale: string }) {
  const t = useTranslations("breakpoint.hereFor");
  const [me, setMe] = useMe();
  const graph = useGraphIndex(null);

  const [adds, setAdds] = useState<HereForHandle[]>([]);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const prefilled = useRef(false);

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
    const start = existing?.adds ?? [];
    const requested = toHandle(params.get("add") ?? "");
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

  const addHandle = (value: string) => {
    const next = toHandle(value);
    setMessage(null);
    if (!next) return setMessage(t("errors.invalid_handle"));
    if (next === ownHandle) return setMessage(t("errors.self_add"));
    if (adds.includes(next))
      return setMessage(t("errors.duplicate", { handle: next }));
    if (adds.length >= HERE_FOR_MAX_ADDS) return setMessage(t("errors.full"));
    setAdds([...adds, next]);
    setDraft("");
  };

  const ready =
    ownHandle !== null && adds.length === HERE_FOR_MAX_ADDS && !closed;
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
    if (!ownHandle) return setMessage(t("errors.auth_required"));
    if (adds.length !== HERE_FOR_MAX_ADDS)
      return setMessage(t("errors.invalid_adds"));
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

  const step = result ? 2 : ownHandle ? 1 : 0;
  const steps = ["handle", "picks", "post"] as const;

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
          <div>
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
              <div className="flex flex-col gap-2xs p-s md:px-l md:pt-l">
                <p className={`${hereForType.label} text-text-secondary`}>
                  {t("add.handleLabel")}
                </p>
                {ownHandle ? (
                  <div className="flex h-12 items-center justify-between gap-xs border border-stroke-secondary bg-black pl-xs pr-2xs">
                    <span
                      className={`truncate ${hereForType.input} text-white`}
                    >
                      {ownHandle}
                    </span>
                    {!closed && (
                      <button
                        type="button"
                        onClick={async () => {
                          await signOutOfX();
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
                  <Button
                    label={t("add.signIn")}
                    onClick={() => {
                      window.location.href = xSignInUrl();
                    }}
                    disabled={closed || me.status === "loading"}
                    className="h-12 self-start"
                    arrow
                  />
                )}
                <p className={`${hereForType.small} text-text-secondary`}>
                  {ownHandle ? t("add.signedInHint") : t("add.signInHint")}
                </p>
              </div>

              <div className="flex flex-col gap-xs border-t border-stroke-primary p-s md:px-l">
                <p className={`${hereForType.label} text-text-secondary`}>
                  {t("add.picksLabel")}
                </p>
                <ol className="unstyled-list grid gap-2xs md:grid-cols-3">
                  {Array.from({ length: HERE_FOR_MAX_ADDS }, (_, i) => {
                    const value = adds[i];
                    return (
                      <li
                        key={i}
                        className={`relative flex min-h-[104px] flex-col items-center justify-center p-xs text-center [container-type:inline-size] ${
                          value
                            ? "border border-core-purple bg-black text-white"
                            : "border border-dashed border-stroke-secondary text-neutral-500"
                        }`}
                      >
                        <span className="break-all font-sans text-[clamp(0.75rem,8cqi,1.125rem)] font-normal">
                          {value ?? t("add.empty")}
                        </span>
                        {value && !closed && (
                          <button
                            type="button"
                            onClick={() =>
                              setAdds(adds.filter((h) => h !== value))
                            }
                            aria-label={t("add.remove", { handle: value })}
                            className="absolute right-3xs top-3xs flex size-8 items-center justify-center text-2xl leading-none text-text-secondary transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-core-purple"
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
                    <div className="flex gap-2xs">
                      <div className="flex h-12 flex-1 items-center gap-3xs border border-stroke-secondary bg-black px-xs focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-core-purple">
                        <span
                          aria-hidden="true"
                          className="font-mono text-neutral-500"
                        >
                          @
                        </span>
                        <input
                          id="here-for-add"
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addHandle(draft);
                            }
                          }}
                          placeholder={t("add.addPlaceholder")}
                          autoComplete="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          maxLength={16}
                          className={`h-full w-0 min-w-0 flex-1 bg-transparent ${hereForType.input} text-white outline-none placeholder:text-neutral-500`}
                        />
                      </div>
                      <Button
                        label={t("add.addButton")}
                        onClick={() => addHandle(draft)}
                        variant="secondary"
                        className="h-12"
                      />
                    </div>
                    {suggestions.length > 0 && (
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
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-s border-t border-stroke-primary p-s md:flex-row md:items-center md:px-l">
                <div className="flex flex-1 flex-col gap-3xs">
                  <span
                    className={`${hereForType.caption} text-text-secondary`}
                  >
                    {t("add.postPreview")}
                  </span>
                  <p className={`${hereForType.small} text-white`}>
                    {postText}
                  </p>
                </div>
                {savedHandle ? (
                  <Button
                    label={t("add.postYour3")}
                    onClick={() =>
                      openXIntent(postText, personUrl(locale, savedHandle))
                    }
                    arrow
                  />
                ) : (
                  <Button
                    type="submit"
                    label={
                      saving
                        ? t("add.saving")
                        : returning
                          ? t("add.update")
                          : t("add.save")
                    }
                    disabled={!ready || saving}
                    arrow
                  />
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
