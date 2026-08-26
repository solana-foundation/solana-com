# 200ms situation room

This route is the live Solana slot-time rollout experience. The route component
itself does not change at each milestone: [`page.tsx`](./page.tsx) always
renders `Slot200Experience`. The live milestone UX is calculated in the client,
mainly by [`Hero`](../../../components/slot200/Hero.tsx) and
[`stages.ts`](../../../components/slot200/stages.ts).

## Live data flow

`Slot200Experience` creates one shared slot feed with `useSlotFeed`. The feed
connects to `/api/slot-time/stream`, whose server-side WebSocket bridge listens
to Solana's `slotSubscribe` notifications. The stream supplies:

- the current slot and epoch;
- the current epoch's ending slot;
- rolling one-minute and ten-minute slot-time averages;
- the most recent slot gap; and
- non-vote TPS.

The averages use elapsed wall-clock time divided by the number of slots, rather
than a simple average of WebSocket arrival gaps. If the stream cannot connect,
the client falls back to `/api/slot-time`, marks the rail as degraded, polls the
current average, and generates synthetic visual beats. Synthetic beats are not
counted as measured gaps by the charts or validator attribution tables.

The page does not inspect a protocol feature flag to decide that a speed has
landed. It infers the active speed from measured mainnet timing. Epoch data is
used for the countdown only.

Validator client identities (Jito, Agave BAM, Harmonic, Rakurai, Firedancer…)
come from the on-chain Jito validator history program, decoded by our own RPC
sweep in `lib/slot200/validatorHistory.ts`: one filtered `getProgramAccounts`
with a 300-byte data slice, then sliced `getMultipleAccounts` reads of each
account's recent circular-buffer entries, banded so validators with nearby
cursors share a call. The sweep is cached per epoch inside the schedule
endpoint; while it is cold the schedule ships gossip-version families
(Firedancer vs Agave lineage) and the sweep finishes into the cache after the
response.

## Rollout model

The path is defined in [`stages.ts`](../../../components/slot200/stages.ts):

```ts
[400, 350, 300, 250, 200];
```

Each reduction is 50ms. The stable speed prefers the ten-minute average, using
the one-minute average only when the longer average is unavailable. A stage is
considered settled after the stable average crosses the midpoint between the old
and new speeds:

| Transition | Settled below |
| ---------- | ------------: |
| 400 → 350  |         375ms |
| 350 → 300  |         325ms |
| 300 → 250  |         275ms |
| 250 → 200  |         225ms |

These midpoint thresholds provide a jitter guard. A normal 400ms network can
measure slightly above nominal, so a brief dip in the one-minute average should
not permanently advance the rollout.

Each transition has two temporary phases:

- `flipping`: the one-minute average is below `from - 22ms`;
- `flipped`: the one-minute average is below `from - 28ms` and the ten-minute
  average is below `from - 15ms`.

Once the ten-minute average crosses the midpoint, the new value becomes the next
`from` value and the page begins watching the following step.

## UX by milestone

### 400ms → 350ms

Before the measured transition, the hero shows a slot countdown. The current
source confirms the target as epoch 1020:

```ts
CONFIRMED_EPOCHS = { 350: 1020 };
```

The countdown is drained by real slots, not by a browser timer. During the last
150 slots, the supporting label changes to “final minute” styling.

As timing drops through the transition thresholds:

1. the countdown is replaced by a measured display such as `400 → 373 ms`;
2. the copy changes to indicate that the flip is happening;
3. after the longer-average confirmation, the measured number turns green and
   the copy reports that Solana is `14.3%` faster; and
4. once 350ms is settled, the hero says that 1 of 4 steps is live and points to
   300ms.

The share link changes with each of these states: countdown, flipping, landed,
or current measured speed.

### 350ms → 300ms

The same detection and visual sequence is reused. The landed copy reports
`16.7%` faster and points to 250ms.

The 300ms target is scheduled for epoch 1024:

```ts
CONFIRMED_EPOCHS = { 300: 1024 };
```

While the network is stably at 350ms, the hero shows a slot-based countdown to
the epoch boundary (about three days away when announced). The countdown is
automatically replaced by live measured flip and landed states when mainnet
timing changes.

At the epoch boundary, before the rolling averages have enough evidence of a
faster clock, the hero reports that the activation window is open and keeps the
current 350ms value visible. It does not fall back to an "epoch not yet
scheduled" message during this short measurement window.

### 300ms → 250ms

The same sequence repeats. The landed copy reports `20.0%` faster and points to
200ms. After settling, the holding state reports 3 of 4 steps live.

### 250ms → 200ms

The final transition reports `25.0%` faster. Its landed message says that the
rollout is complete. Once the stable average settles below 225ms, the hero
shows:

> Genesis shipped 400ms. Solana runs 200 — the rollout is complete.

At this point there is no next target and no countdown.

## Other live UX

All dashboard instruments consume the same slot feed:

- the number board shows lower one-minute, ten-minute, and per-slot timings;
- the map pulses more frequently as slots arrive faster;
- the heartbeat and block tape become denser;
- the history chart shows the measured step-down;
- the “slots since you opened” counter increases faster; and
- the blockspace panel continues to show the same block contents, emphasizing
  that blocks become more frequent without changing total blockspace.

The upgraded-stake meter is separate from speed detection. The schedule endpoint
checks validator versions for SIMD-0525-ready releases and periodically reports
the share of stake on those releases. That indicates rollout readiness but does
not prove that the network has reached a particular timing stage.

## Current limitations

- The 350ms and 300ms targets have confirmed epochs. Later countdowns require
  adding their target epochs to `CONFIRMED_EPOCHS`.
- The Hero supports all four future transitions, but the heartbeat and history
  charts have guide lines hardcoded to 400ms, 350ms, and 300ms.
- The heartbeat chart clamps its lower display range at 250ms, so 200ms values
  will be visually clipped until that chart is updated.
- Page metadata and social-card copy are intentionally evergreen; they do not
  update from live measurements.
