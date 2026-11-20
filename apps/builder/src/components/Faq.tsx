import { getTranslations } from "@workspace/i18n/server";
import { links } from "@@/src/content/links";
import { FaqList } from "./FaqList";
import { container } from "./layout";
import { TurnHeading } from "./motion";

export const FAQ_ITEMS = [
  "newToSolana",
  "crypto",
  "whenWhere",
  "ticket",
  "speak",
] as const;

export async function Faq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "builder.faq" });

  return (
    <section id="faq" className="surface-b">
      <div
        className={`${container} grid gap-10 pb-16 pt-16 md:pb-24 md:pt-28 lg:grid-cols-[minmax(0,474px)_minmax(0,1fr)] lg:gap-0 xl:pb-[145px] xl:pt-[144px]`}
      >
        <TurnHeading
          label={t("heading")}
          lines={[{ text: t("heading") }]}
          className="text-[clamp(56px,10vw,160px)] min-[1200px]:text-[144px]"
        />

        <FaqList
          items={FAQ_ITEMS.map((key) => ({
            id: key,
            question: t(`items.${key}.question`),
            // Answers may link to registration with <link>. Until that URL is
            // set, the words stay as plain text.
            answer: t.rich(`items.${key}.answer`, {
              link: (chunks) =>
                links.register ? (
                  <a
                    href={links.register}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-bldr-purple"
                  >
                    {chunks}
                  </a>
                ) : (
                  chunks
                ),
            }),
          }))}
        />
      </div>
    </section>
  );
}
