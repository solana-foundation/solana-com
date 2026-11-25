"use client";

import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import { localizedRoutePath } from "@/config";
import type { HereForMePayload } from "@/lib/here-for/types";
import type { GraphIndex } from "./graph-index";
import { HERE_FOR_PATH, xSignInUrl } from "./client";
import { hereForType } from "./typography";

type JoinCardProps = {
  locale: string;
  me: HereForMePayload | null;
  index: GraphIndex | null;
  focus: number | null;
};

/**
 * The one thing a visitor without a 3 sees over the map: sign in with X, or,
 * once signed in, go pick. Everything else on the map waits until they've
 * added theirs.
 */
export default function JoinCard({ locale, me, index, focus }: JoinCardProps) {
  const t = useTranslations("breakpoint.hereFor");
  const signedIn = me?.xHandle ?? null;
  // A shared person link, or whoever they tapped: show who that person picked.
  const theirs =
    index && focus !== null && index.payload.claimed[focus] === 1
      ? index.outs[focus]!.map((n) => index.payload.handles[n]!)
      : [];

  return (
    <div className="flex flex-col gap-s border-t-[6px] border-core-purple bg-background-secondary p-s md:p-m">
      {theirs.length > 0 && index && focus !== null ? (
        <div className="flex flex-col gap-2xs">
          <p className={`${hereForType.label} text-core-purple`}>
            {t("join.isHereFor", { handle: index.payload.handles[focus]! })}
          </p>
          <ul className="unstyled-list flex flex-wrap gap-3xs">
            {theirs.map((handle) => (
              <li
                key={handle}
                className={`inline-flex h-7 items-center border border-stroke-secondary px-2 ${hereForType.nameCompact} text-white`}
              >
                {handle}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={`${hereForType.label} text-core-purple`}>
          {signedIn
            ? t("join.signedInAs", { handle: signedIn })
            : t("join.eyebrow")}
        </p>
      )}
      <div className="flex flex-col gap-2xs">
        <h1 className="type-h3">{t("join.title")}</h1>
        <p className={`${hereForType.body} text-text-secondary`}>
          {t("join.description")}
        </p>
      </div>
      {signedIn ? (
        <Button
          href={`${HERE_FOR_PATH}/add`}
          label={t("join.pick")}
          arrow
          className="h-12 w-full md:w-auto md:self-start"
        />
      ) : (
        <Button
          label={t("join.signIn")}
          onClick={() => {
            window.location.href = xSignInUrl(
              [],
              localizedRoutePath(locale, `${HERE_FOR_PATH}/add`),
            );
          }}
          arrow
          className="h-12 w-full md:w-auto md:self-start"
        />
      )}
      <p className={`${hereForType.caption} text-text-secondary`}>
        {index && index.size > 0
          ? `${t("join.people", { count: index.size })} · `
          : ""}
        {signedIn ? t("join.signedInHint") : t("join.privacy")}
      </p>
    </div>
  );
}
