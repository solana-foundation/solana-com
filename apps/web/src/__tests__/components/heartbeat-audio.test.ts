import { afterEach, describe, expect, it, vi } from "vitest";
import { HeartbeatAudio } from "@/components/slot200/heartbeatAudio";

type AudioContextWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const audioWindow = window as AudioContextWindow;
const originalAudioContext = Object.getOwnPropertyDescriptor(
  audioWindow,
  "AudioContext",
);
const originalWebkitAudioContext = Object.getOwnPropertyDescriptor(
  audioWindow,
  "webkitAudioContext",
);

function setAudioContextConstructor(
  name: "AudioContext" | "webkitAudioContext",
  value: unknown,
) {
  Object.defineProperty(audioWindow, name, {
    configurable: true,
    value,
    writable: true,
  });
}

function restoreWindowProperty(
  name: "AudioContext" | "webkitAudioContext",
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) {
    Object.defineProperty(audioWindow, name, descriptor);
  } else {
    Reflect.deleteProperty(audioWindow, name);
  }
}

function createAudioContextConstructor() {
  const context = {
    close: vi.fn().mockResolvedValue(undefined),
  } as unknown as AudioContext;

  function fakeAudioContext() {
    return context;
  }

  const constructor = vi.fn(fakeAudioContext);

  return { constructor, context };
}

afterEach(() => {
  restoreWindowProperty("AudioContext", originalAudioContext);
  restoreWindowProperty("webkitAudioContext", originalWebkitAudioContext);
});

describe("HeartbeatAudio", () => {
  it("uses the standard AudioContext constructor", () => {
    const standard = createAudioContextConstructor();
    setAudioContextConstructor("AudioContext", standard.constructor);
    setAudioContextConstructor("webkitAudioContext", undefined);

    const audio = new HeartbeatAudio();

    expect(audio.toggle()).toBe(true);
    expect(audio.on).toBe(true);
    expect(standard.constructor).toHaveBeenCalledOnce();

    expect(audio.toggle()).toBe(false);
    expect(audio.on).toBe(false);
    expect(standard.context.close).toHaveBeenCalledOnce();
  });

  it("falls back to webkitAudioContext when the standard constructor is unavailable", () => {
    const webkit = createAudioContextConstructor();
    setAudioContextConstructor("AudioContext", undefined);
    setAudioContextConstructor("webkitAudioContext", webkit.constructor);

    const audio = new HeartbeatAudio();

    expect(audio.toggle()).toBe(true);
    expect(audio.on).toBe(true);
    expect(webkit.constructor).toHaveBeenCalledOnce();
  });

  it("stays off when the browser provides no audio context constructor", () => {
    setAudioContextConstructor("AudioContext", undefined);
    setAudioContextConstructor("webkitAudioContext", undefined);

    const audio = new HeartbeatAudio();

    expect(audio.toggle()).toBe(false);
    expect(audio.on).toBe(false);
  });
});
