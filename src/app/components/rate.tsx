"use client";
import { cn } from "./utils";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, FormEvent } from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "fumadocs-ui/components/ui/collapsible";
import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import { ReadableStream } from "stream/web";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";

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
  const [userFeedback, setUserFeedback] = useState<Feedback | null>(null);
  const [opinion, setOpinion] = useState<"positive" | "negative" | null>(null);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();

    // Don't submit if message is empty
    if (!message.trim()) return;

    setUserFeedback({
      opinion: opinion!,
      message,
    });

    setIsStreaming(true);
    setResponse("");

    try {
      const stream = await onRateAction(pathname, {
        opinion: opinion!,
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

  return (
    <div className="flex flex-col gap-2">
      <Collapsible
        open={opinion !== null || userFeedback !== null}
        onOpenChange={(v) => {
          if (!v) setOpinion(null);
        }}
        className="border-y py-3"
      >
        <FeedbackRatingButtons
          opinion={opinion}
          userFeedback={userFeedback}
          onSetOpinion={setOpinion}
        />

        <CollapsibleContent className="mt-3">
          {userFeedback ? (
            // Feedback submitted view
            <FeedbackResponseView
              isStreaming={isStreaming}
              response={response}
              onMoreFeedback={() => {
                setOpinion(userFeedback?.opinion);
                setUserFeedback(null);
                setMessage("");
              }}
            />
          ) : (
            // Feedback form view
            <FeedbackForm
              message={message}
              setMessage={setMessage}
              onSubmit={submit}
            />
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

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

function FeedbackRatingButtons({
  opinion,
  userFeedback,
  onSetOpinion,
}: {
  opinion: "positive" | "negative" | null;
  userFeedback: Feedback | null;
  onSetOpinion: (_value: "positive" | "negative") => void;
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <p className="text-sm font-medium pe-2">Is this page helpful?</p>
      <button
        disabled={userFeedback !== null}
        className={cn(
          rateButtonVariants({
            active: (userFeedback?.opinion ?? opinion) === "positive",
          }),
        )}
        onClick={() => onSetOpinion("positive")}
      >
        <ThumbsUp />
      </button>
      <button
        disabled={userFeedback !== null}
        className={cn(
          rateButtonVariants({
            active: (userFeedback?.opinion ?? opinion) === "negative",
          }),
        )}
        onClick={() => onSetOpinion("negative")}
      >
        <ThumbsDown />
      </button>
    </div>
  );
}

function FeedbackForm({
  message,
  setMessage,
  onSubmit,
}: {
  message: string;
  setMessage: (_value: string) => void;
  onSubmit: (_e: FormEvent) => void;
}) {
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
      <button
        type="submit"
        className={cn(buttonVariants({ color: "outline" }), "w-fit px-3")}
        disabled={!message.trim()}
      >
        Submit
      </button>
    </form>
  );
}

function FeedbackResponseView({
  isStreaming,
  response,
  onMoreFeedback,
}: {
  isStreaming: boolean;
  response: string;
  onMoreFeedback: () => void;
}) {
  return (
    <div className="px-3 py-6 flex flex-col items-center gap-3 bg-fd-card text-sm text-center rounded-xl">
      <button
        className={cn(
          buttonVariants({
            color: "secondary",
          }),
          "text-xs",
        )}
        onClick={onMoreFeedback}
      >
        Have more feedback?
      </button>

      <div className="w-full p-3 bg-fd-secondary/30">
        {isStreaming ? (
          <LoadingIndicator />
        ) : response ? (
          <MarkdownResponse response={response} />
        ) : null}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center py-4 w-full">
      <Loader2
        className="h-5 w-5 text-fd-muted-foreground"
        style={{ animation: "spin 0.5s linear infinite" }}
      />
      <span className="ml-2 text-fd-muted-foreground">
        Generating response...
      </span>
    </div>
  );
}

function MarkdownResponse({ response }: { response: string }) {
  return (
    <div className="text-left w-full prose prose-sm max-w-none dark:prose-invert">
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
