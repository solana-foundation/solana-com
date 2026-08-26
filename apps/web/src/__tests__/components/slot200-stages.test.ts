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

  it("shows an activation state when slots cross the boundary before the epoch snapshot refreshes", () => {
    const rollout = rolloutState(350, 350);

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
});
