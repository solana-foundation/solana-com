import { describe, expect, it } from "vitest";
import { isActivationWindow, rolloutState } from "@/components/slot200/stages";

describe("the 350ms to 300ms rollout", () => {
  it("keeps the scheduled 300ms target while the network is stable at 350ms", () => {
    const rollout = rolloutState(352, 351);

    expect(rollout).toMatchObject({
      from: 350,
      to: 300,
      phase: "pre",
      stepsDone: 1,
      targetEpoch: 1024,
    });
    expect(isActivationWindow(rollout, 1023)).toBe(false);
  });

  it("shows an activation state after epoch 1024 until timing starts to move", () => {
    const rollout = rolloutState(350, 350);

    expect(isActivationWindow(rollout, 1024)).toBe(true);
  });

  it("does not resurrect an old flip when a seeded average lags mainnet", () => {
    expect(rolloutState(360, 400, 1024)).toMatchObject({
      from: 350,
      to: 300,
      phase: "pre",
      targetEpoch: 1024,
    });
  });

  it("repairs an expired seed after the following activation epoch begins", () => {
    expect(rolloutState(360, 400, 1025)).toMatchObject({
      from: 350,
      to: 300,
      phase: "pre",
      targetEpoch: 1024,
    });
  });

  it("does not skip to an unscheduled step on a transient one-minute average", () => {
    expect(rolloutState(320, 350, 1025)).toMatchObject({
      from: 350,
      to: 300,
      phase: "flipping",
      targetEpoch: 1024,
    });
  });

  it("does not skip multiple stages when a stale seed and current average disagree", () => {
    expect(rolloutState(300, 400, 1025)).toMatchObject({
      from: 350,
      to: 300,
      phase: "flipping",
      targetEpoch: 1024,
    });
  });

  it("does not rebase a stale seed without a current measurement", () => {
    expect(rolloutState(null, 400, 1025)).toMatchObject({
      from: 400,
      to: 350,
      targetEpoch: 1020,
    });
  });

  it("shows an activation state when slots cross the boundary before the epoch snapshot refreshes", () => {
    const rollout = rolloutState(350, 350);

    expect(isActivationWindow(rollout, 1023, 441_999_999, 442_000_000)).toBe(
      false,
    );
    expect(isActivationWindow(rollout, 1023, 442_000_000, 442_000_000)).toBe(
      true,
    );
  });

  it("progresses from measuring the flip to the settled 300ms holding state", () => {
    expect(rolloutState(320, 340)).toMatchObject({
      from: 350,
      to: 300,
      phase: "flipping",
    });
    expect(rolloutState(320, 330)).toMatchObject({
      from: 350,
      to: 300,
      phase: "flipped",
    });
    expect(rolloutState(301, 320)).toMatchObject({
      from: 300,
      to: 250,
      phase: "pre",
      stepsDone: 2,
      targetEpoch: null,
    });
  });

  it("keeps the rollout complete at the terminal 200ms step", () => {
    expect(rolloutState(199, 199, 1025)).toMatchObject({
      from: 200,
      to: null,
      phase: "pre",
      stepsDone: 4,
      targetEpoch: null,
    });
  });
});
