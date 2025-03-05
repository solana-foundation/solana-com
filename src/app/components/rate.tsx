"use client";
import { cn } from "./utils";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import { useState, FormEvent, useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "fumadocs-ui/components/ui/collapsible";
import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import { ReadableStream } from "stream/web";
import ReactMarkdown from "react-markdown";

const rateButtonVariants = cva(
  "inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current",
        false: "text-fd-muted-foreground",
      },
    },
  },
);

export interface Feedback {
  opinion: "positive" | "negative";
  message: string;
}

export function Rate({
  onRateAction,
}: {
  onRateAction: (
    _url: string,
    _feedback: Feedback,
  ) => Promise<ReadableStream<string>>;
}) {
  const pathname = usePathname();
  const [opinion, setOpinion] = useState<"positive" | "negative" | null>(null);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showResponseView, setShowResponseView] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Don't submit if message is empty
    if (!message.trim()) return;

    // Always start generating immediately on submit
    setIsStreaming(true);
    setResponse("");

    try {
      const stream = await onRateAction(pathname, {
        opinion: opinion,
        message,
      });

      const reader = stream.getReader();
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        setResponse((prev) => prev + value);

        if (isFirstChunk) {
          setIsStreaming(false);
          isFirstChunk = false;
        }
      }
    } catch (error) {
      console.error("Error processing stream:", error);
      setResponse("Error processing your feedback. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }

  const handleReset = () => {
    setShowResponseView(false);
    setMessage("");
    setResponse("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Collapsible
        open={opinion !== null || response !== ""}
        onOpenChange={(v) => {
          if (!v) setOpinion(null);
        }}
        className="border-y py-3"
      >
        <FeedbackRatingButtons
          opinion={opinion}
          isDisabled={response !== ""}
          onSetOpinion={setOpinion}
        />

        <CollapsibleContent className="mt-3">
          {showResponseView ? (
            <FeedbackResponseView
              response={response}
              onMoreFeedback={handleReset}
            />
          ) : (
            <FeedbackForm
              message={message}
              hasContent={response !== ""}
              isStreaming={isStreaming}
              setMessage={setMessage}
              onSubmit={handleSubmit}
              onViewResponse={() => setShowResponseView(true)}
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Rating buttons component
function FeedbackRatingButtons({
  opinion,
  isDisabled,
  onSetOpinion,
}: {
  opinion: "positive" | "negative" | null;
  isDisabled: boolean;
  onSetOpinion: (_value: "positive" | "negative") => void;
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <p className="text-sm font-medium pe-2">Is this page helpful?</p>
      <button
        disabled={isDisabled}
        className={cn(
          rateButtonVariants({
            active: opinion === "positive",
          }),
        )}
        onClick={() => onSetOpinion("positive")}
      >
        <ThumbsUp />
      </button>
      <button
        disabled={isDisabled}
        className={cn(
          rateButtonVariants({
            active: opinion === "negative",
          }),
        )}
        onClick={() => onSetOpinion("negative")}
      >
        <ThumbsDown />
      </button>
    </div>
  );
}

// Form component for feedback input
function FeedbackForm({
  message,
  hasContent,
  isStreaming,
  setMessage,
  onSubmit,
  onViewResponse,
}: {
  message: string;
  hasContent: boolean;
  isStreaming: boolean;
  setMessage: (_value: string) => void;
  onSubmit: (_e: FormEvent) => void;
  onViewResponse: () => void;
}) {
  // Compute button props based on current state
  const buttonProps = useMemo(() => {
    const baseButtonProps = {
      className: cn(buttonVariants({ color: "outline" }), "w-fit px-3"),
    };

    if (isStreaming) {
      return {
        ...baseButtonProps,
        type: "button" as const,
        disabled: true,
        children: (
          <span className="flex items-center justify-center">
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            Searching for additional resources you might find helpful...
          </span>
        ),
      };
    }

    if (hasContent) {
      return {
        ...baseButtonProps,
        type: "button" as const,
        onClick: onViewResponse,
        children: "View Response",
      };
    }

    return {
      ...baseButtonProps,
      type: "submit" as const,
      disabled: !message.trim(),
      children: "Submit",
    };
  }, [hasContent, isStreaming, message, onViewResponse]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <textarea
        autoFocus
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded-lg bg-fd-secondary p-3 resize-none focus-visible:outline-none text-sm"
        placeholder="Please share your feedback to help improve this content."
        onKeyDown={(e) => {
          if (!e.shiftKey && e.key === "Enter") {
            onSubmit(e);
          }
        }}
      />
      <div className="flex gap-2 items-center">
        <button {...buttonProps} />
      </div>
    </form>
  );
}

// Component to display feedback response
function FeedbackResponseView({
  response,
  onMoreFeedback,
}: {
  response: string;
  onMoreFeedback: () => void;
}) {
  const buttonClasses = cn(
    buttonVariants({
      color: "secondary",
    }),
    "text-xs",
  );

  return (
    <div className="px-3 py-6 flex flex-col items-center gap-3 bg-fd-card text-sm text-center rounded-xl">
      <button className={buttonClasses} onClick={onMoreFeedback}>
        Have more feedback?
      </button>
      <MarkdownResponse response={response} />
    </div>
  );
}

// Component to render markdown response
function MarkdownResponse({ response }: { response: string }) {
  return (
    <div className="px-2 text-left prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          a: ({ ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
}
