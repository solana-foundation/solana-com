import type { FAQPageItem } from "@/content/faq-page";
import { getAnchorLinkProps } from "@/lib/links";

type FAQAnswerProps = {
  className?: string;
  item: Pick<FAQPageItem, "answer" | "answerHref" | "answerLinkLabel">;
};

export default function FAQAnswer({
  className = "type-paragraph text-white md:pr-2xl",
  item,
}: FAQAnswerProps) {
  return (
    <p className={className}>
      {item.answer}
      {item.answerHref && (
        <>
          {" "}
          <a
            href={item.answerHref}
            className="underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-80"
            {...getAnchorLinkProps({ href: item.answerHref })}
          >
            {item.answerLinkLabel ?? item.answerHref}
          </a>
          .
        </>
      )}
    </p>
  );
}
