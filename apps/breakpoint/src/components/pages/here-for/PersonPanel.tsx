"use client";

import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import { HERE_FOR_MAX_ADDS } from "@/lib/here-for/types";
import { isMutual, type GraphIndex } from "./graph-index";
import {
  HERE_FOR_PATH,
  handleSlug,
  joinHandles,
  openXIntent,
  personUrl,
  withAsk,
} from "./client";
import { hereForType } from "./typography";

const ADDED_BY_LIMIT = 12;

type PersonPanelProps = {
  index: GraphIndex;
  locale: string;
  focus: number | null;
  you: number | null;
  path: number[];
  onSelect: (node: number) => void;
};

const chipClass = `inline-flex h-7 items-center border px-2 ${hereForType.nameCompact} transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-core-purple`;

export default function PersonPanel({
  index,
  locale,
  focus,
  you,
  path,
  onSelect,
}: PersonPanelProps) {
  const t = useTranslations("breakpoint.hereFor");
  const handles = index.payload.handles;

  if (focus === null) {
    return (
      <aside
        aria-label={t("panel.label")}
        className="flex h-full flex-col gap-s border-t-[6px] border-core-purple bg-background-secondary p-s"
      >
        <p className={`${hereForType.label} text-text-secondary`}>
          {t("panel.selectSomeone")}
        </p>
        <p className={`${hereForType.body} text-text-secondary`}>
          {t("panel.selectHint")}
        </p>
        <div className="mt-auto flex flex-col gap-2xs">
          <Button href={`${HERE_FOR_PATH}/add`} label={t("nav.add")} arrow />
        </div>
      </aside>
    );
  }

  const handle = handles[focus]!;
  const isYou = focus === you;
  const yourAdds = you !== null ? index.outs[you]! : [];
  const inYour3 = yourAdds.includes(focus);
  const steps = path.length - 1;
  const claimed = index.payload.claimed[focus] === 1;
  const outs = index.outs[focus]!;
  const ins = index.ins[focus]!;
  const mutualCount = outs.filter((n) => isMutual(index, focus, n)).length;

  const kind = isYou
    ? t("panel.yourNode")
    : inYour3
      ? t("panel.inYour3")
      : steps > 0
        ? t("panel.steps", { count: steps })
        : t("panel.notConnected");

  const share = () => {
    const url = personUrl(locale, handle);
    const ask = t("share.ask");
    const hasAdded = (n: number) => index.payload.claimed[n] === 1;
    if (isYou) {
      openXIntent(
        withAsk(
          t("share.your3", {
            count: outs.length,
            handles: joinHandles(outs.map((n) => handles[n]!)),
          }),
          ask,
          !outs.every(hasAdded),
        ),
        url,
      );
    } else if (you !== null && isMutual(index, focus, you)) {
      openXIntent(
        t("share.mutual", { handle }),
        personUrl(locale, handles[you]!, { with: handle }),
      );
    } else {
      openXIntent(withAsk(t("share.person", { handle }), ask, !claimed), url);
    }
  };

  const primary = isYou
    ? outs.length < HERE_FOR_MAX_ADDS
      ? {
          href: `${HERE_FOR_PATH}/add`,
          label: t("panel.addMore", {
            count: HERE_FOR_MAX_ADDS - outs.length,
          }),
        }
      : { href: `${HERE_FOR_PATH}/find`, label: t("explorer.findMutuals") }
    : inYour3
      ? null
      : {
          href: `${HERE_FOR_PATH}/add?add=${handleSlug(handle)}`,
          label: t("panel.addToYour3"),
        };

  return (
    <aside
      aria-label={t("panel.label")}
      aria-live="polite"
      className="flex h-full min-h-0 flex-col border-t-[6px] border-core-purple bg-background-secondary"
    >
      <div className="flex flex-col gap-2xs p-s">
        <p className={`${hereForType.label} text-core-purple`}>{kind}</p>
        <h2 className="type-h5 break-all">{handle}</h2>
        <dl className="mt-2xs grid grid-cols-3 border border-stroke-primary">
          <Stat label={t("panel.added")} value={outs.length} />
          <Stat label={t("panel.addedBy")} value={ins.length} />
          <Stat label={t("panel.mutuals")} value={mutualCount} accent />
        </dl>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p
          className={`border-t border-stroke-primary px-s pb-3xs pt-xs ${hereForType.label} text-text-secondary`}
        >
          {isYou ? t("panel.your3") : t("panel.their3")}
        </p>
        {claimed ? (
          <ol className="unstyled-list">
            {outs.map((node) => (
              <li key={node}>
                <button
                  type="button"
                  onClick={() => onSelect(node)}
                  className={`flex h-12 w-full items-center gap-xs border-b border-stroke-primary px-s text-left ${hereForType.item} transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple`}
                >
                  <span className="flex-1 truncate">{handles[node]}</span>
                  {isMutual(index, focus, node) && (
                    <span
                      className={`bg-core-green px-[6px] py-[3px] ${hereForType.tag} text-black`}
                    >
                      {t("panel.mutual")}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className={`px-s pb-xs ${hereForType.small} text-text-secondary`}>
            {t("panel.notJoined")}
          </p>
        )}

        <p
          className={`px-s pb-3xs pt-xs ${hereForType.label} text-text-secondary`}
        >
          {t("panel.addedBy")}
        </p>
        <div className="flex flex-wrap gap-3xs px-s">
          {ins.length === 0 && (
            <span className={`${hereForType.small} text-text-secondary`}>
              {t("panel.nobodyAdded")}
            </span>
          )}
          {ins.slice(0, ADDED_BY_LIMIT).map((node) => (
            <button
              key={node}
              type="button"
              onClick={() => onSelect(node)}
              className={`${chipClass} ${
                isMutual(index, focus, node)
                  ? "border-core-green text-core-green hover:bg-core-green hover:text-black"
                  : "border-stroke-secondary text-white hover:border-white"
              }`}
            >
              {handles[node]}
            </button>
          ))}
          {ins.length > ADDED_BY_LIMIT && (
            <span
              className={`inline-flex h-7 items-center ${hereForType.small} text-text-secondary`}
            >
              {t("panel.more", { count: ins.length - ADDED_BY_LIMIT })}
            </span>
          )}
        </div>

        {!isYou && (
          <>
            <p
              className={`px-s pb-3xs pt-s ${hereForType.label} text-text-secondary`}
            >
              {t("panel.howYouConnect")}
            </p>
            <div className="flex flex-wrap items-center gap-3xs px-s pb-s">
              {you === null ? (
                <span className={`${hereForType.small} text-text-secondary`}>
                  {t("panel.joinToConnect")}
                </span>
              ) : path.length === 0 ? (
                <span className={`${hereForType.small} text-text-secondary`}>
                  {t("panel.noPath")}
                </span>
              ) : (
                path.map((node) => (
                  <button
                    key={node}
                    type="button"
                    onClick={() => onSelect(node)}
                    className={`${chipClass} ${
                      node === you
                        ? "border-core-yellow bg-core-yellow text-black"
                        : "border-core-yellow text-white hover:bg-core-yellow hover:text-black"
                    }`}
                  >
                    {node === you ? t("explorer.you") : handles[node]}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2xs border-t border-stroke-primary p-s">
        {primary && (
          <Button
            href={primary.href}
            label={primary.label}
            arrow
            className="flex-1 whitespace-nowrap"
          />
        )}
        <Button
          label={t("panel.share")}
          onClick={share}
          variant="secondary"
          className="flex-1 whitespace-nowrap"
        />
      </div>
    </aside>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col-reverse justify-end gap-2xs border-l border-stroke-primary px-2xs py-xs first:border-l-0 md:px-3xs min-[1300px]:px-2xs">
      <dt
        className={`${hereForType.caption} leading-tight text-text-secondary`}
      >
        {label}
      </dt>
      <dd
        className={`${hereForType.statLarge} md:text-base min-[1300px]:text-2xl lg:text-4xl ${accent ? "text-core-green" : "text-white"}`}
      >
        {value}
      </dd>
    </div>
  );
}
