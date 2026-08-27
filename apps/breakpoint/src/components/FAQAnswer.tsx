import type { FAQPageItem } from "@/content/faq-page";
import { breakpointHref, getAnchorLinkProps } from "@/lib/links";

type FAQAnswerProps = {
  className?: string;
  item: Pick<FAQPageItem, "answer" | "answerHref" | "answerLinkLabel">;
};

export default function FAQAnswer({
  className = "type-paragraph text-white md:pr-2xl",
  item,
}: FAQAnswerProps) {
  const resolvedHref = item.answerHref
    ? breakpointHref(item.answerHref)
    : undefined;

  const answerText = item.answer?.trim() ?? "";

  return (
    <p className={className}>
      {answerText}
      {resolvedHref && (
        <>
          {answerText ? " " : null}
          <a
            href={resolvedHref}
            className="underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-80"
            {...getAnchorLinkProps({ href: resolvedHref })}
          >
            {item.answerLinkLabel ?? item.answerHref}
          </a>
          .
        </>
      )}
    </p>
  );
}
