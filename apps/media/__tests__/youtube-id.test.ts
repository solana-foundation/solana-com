import { describe, expect, it } from "vitest";
import {
  extractYouTubeVideoId,
  isYouTubeVideoId,
  YOUTUBE_ID_PATTERN,
} from "@/lib/youtube-id";

describe("isYouTubeVideoId", () => {
  it("validates 11-character alphanumeric and dash/underscore IDs", () => {
    expect(isYouTubeVideoId("S01WYrw-5b8")).toBe(true);
    expect(isYouTubeVideoId("Uc9zvaerY_o")).toBe(true);
    expect(isYouTubeVideoId("6bxWGU7mpJI")).toBe(true);
  });

  it("rejects invalid IDs", () => {
    expect(isYouTubeVideoId("")).toBe(false);
    expect(isYouTubeVideoId("too-short")).toBe(false);
    expect(isYouTubeVideoId("this-is-way-too-long-to-be-an-id")).toBe(false);
    expect(isYouTubeVideoId("invalid!char")).toBe(false);
  });
});

describe("extractYouTubeVideoId", () => {
  it.each([
    ["S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://youtube.com/watch?v=S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://www.youtube.com/watch?v=S01WYrw-5b8", "S01WYrw-5b8"],
    [
      "https://www.youtube.com/watch?feature=share&v=S01WYrw-5b8",
      "S01WYrw-5b8",
    ],
    ["https://www.youtube.com/watch?t=10s&v=S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://youtu.be/S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://youtu.be/S01WYrw-5b8?t=10", "S01WYrw-5b8"],
    ["https://youtube.com/embed/S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://www.youtube-nocookie.com/embed/S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://youtube.com/live/S01WYrw-5b8?feature=share", "S01WYrw-5b8"],
    ["https://www.youtube.com/shorts/S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://youtube.com/v/S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://m.youtube.com/watch?v=S01WYrw-5b8", "S01WYrw-5b8"],
    ["https://music.youtube.com/watch?v=S01WYrw-5b8", "S01WYrw-5b8"],
  ])("normalizes %s", (input, expected) => {
    expect(extractYouTubeVideoId(input)).toBe(expected);
  });

  it.each([
    "",
    "not-a-valid-video",
    "invalid video id",
    "https://example.com/watch?v=S01WYrw-5b8",
    "https://youtube.com.example.com/watch?v=S01WYrw-5b8",
    "https://youtube.com/watch?v=short",
    "https://youtube.com/channel/UC1234567890",
    "https://youtube.com/user/solanalabs",
  ])("rejects %s", (input) => {
    expect(extractYouTubeVideoId(input)).toBeNull();
  });
});
