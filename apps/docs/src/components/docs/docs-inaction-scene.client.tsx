"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "@/components/tx-walkthrough/tx-walkthrough.client";

/**
 * <InActionScene kind="checkout" /> and <InActionScene kind="token" /> on
 * "Solana in action": one action and its result, in the spirit of
 * payments.org's live demo, beside a "What Solana is doing" panel like the
 * 2048 game's.
 *
 * Only a reader's tap sends anything: "Pay 1 USDC" sends a real devnet USDC
 * transfer through /api/demo/checkout, and "Create token" makes a real
 * devnet Token-2022 mint through /api/demo/create-token (server-held test
 * wallets). The panel's steps light up as the request goes: sign while the
 * server builds and signs it, send once the route streams that it's sent,
 * final once it's confirmed (on Solana, confirmed is final). Then the scene
 * links to Explorer with the measured confirmation time. If the route can't
 * send one (no wallets on this deployment, out of test funds,
 * rate-limited), the scene still plays and says quietly that the Explorer
 * link is unavailable.
 *
 * Scrolling into view never calls a route: the button pulses and waits.
 * Reduced motion drops the animation, not the transaction.
 */
export type SceneKind = "checkout" | "token";

export function InActionScene({ kind }: { kind: SceneKind }) {
  return kind === "checkout" ? <CheckoutScene /> : <TokenScene />;
}

/** The shortest each pending step shows, so a fast reply still reads. */
const STEP_MS = 400;
const TIMEOUT_MS = 25_000;
const EXPLORER = "https://explorer.solana.com";

/** A confirmed devnet transaction, null when the route couldn't send one,
 * or undefined before the first tap. */
type Sent = { signature: string; ms: number; mint?: string } | null | undefined;

/**
 * POST to a demo route. The route streams NDJSON: `{ step: "sent" }` once
 * the transaction is out, then the result. Calls `onSent` on the first.
 */
async function postDemo(path: string, onSent: () => void): Promise<Sent> {
  try {
    const res = await fetch(path, {
      method: "POST",
      signal: AbortSignal.timeout?.(TIMEOUT_MS),
    });
    if (!res.ok || !res.body) return null;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let last: Record<string, unknown> = {};
    const take = (line: string) => {
      if (!line.trim()) return;
      const body = JSON.parse(line) as Record<string, unknown>;
      if (body.step === "sent") onSent();
      else last = body;
    };
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = text.indexOf("\n")) >= 0) {
        take(text.slice(0, nl));
        text = text.slice(nl + 1);
      }
    }
    take(text);
    const { signature, ms, mint } = last;
    return typeof signature === "string" && typeof ms === "number"
      ? { signature, ms, ...(typeof mint === "string" ? { mint } : {}) }
      : null;
  } catch {
    return null;
  }
}

/** Seconds with one decimal, never "0.0". */
function seconds(ms: number) {
  return `${Math.max(0.1, ms / 1000).toFixed(1)} s`;
}

function ExplorerLink({
  sent,
  children = "View on Explorer",
}: {
  sent: Sent;
  children?: string;
}) {
  if (sent === undefined) return null;
  return sent ? (
    <a
      className="sol-scene-tx"
      href={`${EXPLORER}/tx/${sent.signature}?cluster=devnet`}
      target="_blank"
      rel="noopener"
    >
      {children}
    </a>
  ) : (
    <span className="sol-scene-tx" data-off="">
      Explorer link unavailable
    </span>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** True once the element has been mostly on screen. */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** idle, then sign (request out), send (route says sent), done. */
type Phase = "idle" | "sign" | "send" | "done";
const STEP_OF: Record<Phase, number> = { idle: -1, sign: 0, send: 1, done: 2 };

/** One tap's request to `path`, stepping through the phases as it goes. */
function useDemo(path: string) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [sent, setSent] = useState<Sent>(undefined);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    const wait = (ms: number) =>
      new Promise<void>((r) => (reduced ? r() : setTimeout(r, ms)));
    setPhase("sign");
    let markSent = () => {};
    const isSent = new Promise<void>((r) => (markSent = r));
    const request = postDemo(path, markSent);
    await Promise.all([wait(STEP_MS), Promise.race([isSent, request])]);
    if (!alive.current) return;
    setPhase("send");
    const [result] = await Promise.all([request, wait(STEP_MS)]);
    if (!alive.current) return;
    setSent(result);
    setPhase("done");
  }, [path, reduced]);

  return { phase, sent, run, reduced };
}

/** The "What Solana is doing" panel; the step happening now lights up. */
function Explain({
  flow,
  steps,
  phase,
}: {
  flow: [string, string, string, string];
  steps: [string, string][];
  phase: Phase;
}) {
  const now = STEP_OF[phase];
  return (
    <div className="sol-inaction-explain">
      <p className="sol-inaction-kicker">What Solana is doing</p>
      <div className="sol-inaction-flow" aria-hidden="true">
        {flow.map((label, i) => (
          <Fragment key={label}>
            {i ? <i /> : null}
            <span className={i === 2 ? "is-code" : undefined}>{label}</span>
          </Fragment>
        ))}
      </div>
      <ol className="sol-inaction-steps">
        {steps.map(([title, body], i) => (
          <li
            key={title}
            data-on={i === now ? "" : undefined}
            data-done={i < now ? "" : undefined}
            aria-current={i === now && phase !== "done" ? "step" : undefined}
          >
            <p className="sol-inaction-step-t">{title}</p>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CheckoutScene() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const { phase, sent, run, reduced } = useDemo("/api/demo/checkout");
  const [order, setOrder] = useState(1001);
  const done = phase === "done";
  const busy = phase === "sign" || phase === "send";

  const pay = () => {
    if (busy) return;
    if (done) setOrder((n) => n + 1);
    void run();
  };

  return (
    <div className="sol-inaction not-prose">
      <div
        ref={ref}
        className="sol-scene"
        data-kind="checkout"
        data-phase={phase}
        data-intro={seen ? "" : undefined}
        data-motion={reduced ? "off" : "on"}
      >
        <div className="sol-scene-device">
          <div className="sol-scene-merchant">
            <span className="sol-scene-logo" aria-hidden="true">
              <StarIcon />
            </span>
            <span>
              <span className="sol-scene-name">Sticker shop</span>
              <span className="sol-scene-sub">Holographic sticker</span>
            </span>
          </div>
          <p className="sol-scene-amount">
            1 <span>USDC</span>
          </p>
          <button
            type="button"
            className="sol-scene-btn"
            data-state={busy ? "pending" : phase}
            disabled={phase !== "idle"}
            onClick={pay}
            aria-live="polite"
          >
            {busy ? (
              <>
                <span className="sol-scene-spin" aria-hidden="true" /> Paying
              </>
            ) : done ? (
              <>
                <CheckIcon /> {sent ? `Paid in ${seconds(sent.ms)}` : "Paid"}
              </>
            ) : (
              "Pay 1 USDC"
            )}
          </button>
          <p className="sol-scene-foot">
            {done ? (
              <button type="button" className="sol-scene-again" onClick={pay}>
                Pay again
              </button>
            ) : null}
          </p>
        </div>

        <div className="sol-scene-note" aria-live="polite">
          <span className="sol-scene-sub">Sticker shop</span>
          {done ? (
            <>
              <p className="sol-scene-order" key={order} data-ok="">
                <CheckIcon /> Order #{order} paid
              </p>
              <ExplorerLink sent={sent} />
            </>
          ) : (
            <p className="sol-scene-order">Order #{order} waiting</p>
          )}
        </div>
      </div>
      <Explain
        phase={phase}
        flow={["Pay", "Transaction", "Token program", "Shop's account"]}
        steps={[
          [
            "Sign: the customer approves 1 USDC",
            "The transaction holds one transfer, from the customer's USDC account to the shop's. A test wallet on the server signs it here, where a customer's wallet app would.",
          ],
          [
            "Send: a validator runs the transfer",
            "The validator producing blocks right now runs the Token program, which checks the signature and the balance, then moves the USDC. The fee is a fraction of a cent.",
          ],
          [
            "Final: the shop sees it paid",
            "Once the network confirms the block, the payment is final. The shop watches its account and marks the order paid.",
          ],
        ]}
      />
    </div>
  );
}

/** "abcd…wxyz" */
const short = (address: string) =>
  `${address.slice(0, 4)}…${address.slice(-4)}`;

function TokenScene() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const { phase, sent, run, reduced } = useDemo("/api/demo/create-token");
  const done = phase === "done";
  const busy = phase === "sign" || phase === "send";
  const create = () => {
    if (!busy) void run();
  };

  return (
    <div className="sol-inaction not-prose">
      <div
        ref={ref}
        className="sol-scene"
        data-kind="token"
        data-phase={phase}
        data-intro={seen ? "" : undefined}
        data-motion={reduced ? "off" : "on"}
      >
        <div className="sol-scene-device">
          <div className="sol-scene-merchant">
            <span className="sol-scene-logo" aria-hidden="true">
              <CoinIcon />
            </span>
            <span>
              <span className="sol-scene-name">Docs demo token</span>
              <span className="sol-scene-sub">Token-2022, 6 decimals</span>
            </span>
          </div>
          <p className="sol-scene-amount">DEMO</p>
          <button
            type="button"
            className="sol-scene-btn"
            data-state={busy ? "pending" : phase}
            disabled={phase !== "idle"}
            onClick={create}
            aria-live="polite"
          >
            {busy ? (
              <>
                <span className="sol-scene-spin" aria-hidden="true" /> Creating
              </>
            ) : done ? (
              <>
                <CheckIcon />{" "}
                {sent ? `Created in ${seconds(sent.ms)}` : "Created"}
              </>
            ) : (
              "Create token"
            )}
          </button>
          <p className="sol-scene-foot">
            {done ? (
              <button
                type="button"
                className="sol-scene-again"
                onClick={create}
              >
                Create another
              </button>
            ) : null}
          </p>
        </div>

        <div className="sol-scene-note" aria-live="polite">
          <span className="sol-scene-sub">Devnet</span>
          {done && sent?.mint ? (
            <>
              <p className="sol-scene-order" key={sent.mint} data-ok="">
                <CheckIcon /> Mint {short(sent.mint)}
              </p>
              <a
                className="sol-scene-tx"
                href={`${EXPLORER}/address/${sent.mint}?cluster=devnet`}
                target="_blank"
                rel="noopener"
              >
                Token on Explorer
              </a>
              {" · "}
              <ExplorerLink sent={sent}>Transaction</ExplorerLink>
            </>
          ) : done ? (
            <>
              <p className="sol-scene-order" data-ok="">
                <CheckIcon /> Token created
              </p>
              <ExplorerLink sent={sent} />
            </>
          ) : (
            <p className="sol-scene-order">No token yet</p>
          )}
        </div>
      </div>
      <Explain
        phase={phase}
        flow={["Create", "Transaction", "Token-2022", "New mint"]}
        steps={[
          [
            "Sign: a new address for the token",
            "The server makes a keypair for the new mint account. The demo wallet signs to pay the fee and rent, and the new key signs to claim the address.",
          ],
          [
            "Send: Token-2022 sets up the mint",
            "One transaction creates the account, sets 6 decimals and who can mint, and writes the name and symbol into the mint itself, with the metadata extension.",
          ],
          [
            "Final: the token exists",
            "Once the network confirms the block, the token is final. Anyone can look it up, and its mint authority can start minting.",
          ],
        ]}
      />
    </div>
  );
}

const CheckIcon = () => (
  <Icon size={15}>
    <path d="m5 12 5 5 9-10" />
  </Icon>
);

const StarIcon = () => (
  <Icon size={18}>
    <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
  </Icon>
);

const CoinIcon = () => (
  <Icon size={18}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
  </Icon>
);

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => void;
};

/**
 * <FullscreenButton target="sol-2048">Full screen</FullscreenButton>: opens
 * the element with that id (the 2048 iframe) in the browser's fullscreen;
 * Esc leaves it. Renders nothing where the browser can't (iPhone Safari) or
 * without JavaScript.
 */
export function FullscreenButton({
  target,
  children,
}: {
  target: string;
  children?: ReactNode;
}) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target) as FullscreenElement | null;
    setSupported(!!(el?.requestFullscreen || el?.webkitRequestFullscreen));
  }, [target]);
  if (!supported) return null;
  const open = () => {
    const el = document.getElementById(target) as FullscreenElement | null;
    if (!el) return;
    if (el.requestFullscreen) void el.requestFullscreen().catch(() => {});
    else el.webkitRequestFullscreen?.();
    el.focus();
  };
  return (
    <button type="button" className="sol-inaction-fs" onClick={open}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
      {children}
    </button>
  );
}
