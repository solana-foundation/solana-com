"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
}

export const AudioPlayer = ({
  url,
  title,
  className,
  autoPlay = false,
}: AudioPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isReady, setIsReady] = useState(false);

  // Waveform canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const waveformBarsRef = useRef<number[]>([]);

  // Format time in MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle seek
  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;

      if (playerRef.current) {
        playerRef.current.seekTo(newTime, "seconds");
      }
    },
    [duration]
  );

  // Handle skip backward (15 seconds)
  const handleSkipBackward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, currentTime - 15), "seconds");
    }
  }, []);

  // Handle skip forward (30 seconds)
  const handleSkipForward = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.min(duration, currentTime + 30), "seconds");
    }
  }, [duration]);

  // Handle volume change
  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  // Toggle mute
  const handleMuteToggle = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Handle playback rate change
  const handlePlaybackRateChange = useCallback(() => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  }, [playbackRate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return; // Don't interfere with input fields
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSkipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSkipForward();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePlayPause, handleSkipBackward, handleSkipForward]);

  // Initialize waveform visualization - generate bars once
  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Generate waveform bars once if not already generated
    const barCount = 100;
    if (waveformBarsRef.current.length === 0) {
      waveformBarsRef.current = Array.from(
        { length: barCount },
        () => Math.random() * 0.8 + 0.1
      );
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw waveform with progress overlay
  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    ctx.clearRect(0, 0, width, height);

    const barCount = waveformBarsRef.current.length;
    const barWidth = width / barCount;

    // Draw static waveform background (transparent white)
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < barCount; i++) {
      const barHeight = waveformBarsRef.current[i] * height;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    }

    // Draw progress overlay (white)
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    const progressWidth = width * progress;

    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth;
      if (x > progressWidth) break;

      const barHeight = waveformBarsRef.current[i] * height;
      const y = (height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    }
  }, [progress]);

  return (
    <div className={cn("w-full rounded-lg bg-card p-3 shadow-lg", className)}>
      {/* Hidden ReactPlayer */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        volume={isMuted ? 0 : volume}
        playbackRate={playbackRate}
        onReady={() => setIsReady(true)}
        onDuration={setDuration}
        onProgress={(state) => setProgress(state.played)}
        width="0"
        height="0"
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />

      {/* Title */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {title}
        </h3>
      </div>

      {/* Waveform Canvas */}
      <div
        className="relative mb-4 h-12 w-full cursor-pointer"
        onClick={handleSeek}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full rounded"
        />
      </div>

      {/* Progress Bar */}
      <div
        className="group relative mb-4 h-1.5 cursor-pointer rounded-full bg-muted"
        onClick={handleSeek}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            left: `${progress * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Time Display */}
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(progress * duration || 0)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipBackward}
            disabled={!isReady}
            className="h-8 w-8"
            aria-label="Skip backward 15 seconds"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={handlePlayPause}
            disabled={!isReady}
            className="h-9 w-9"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipForward}
            disabled={!isReady}
            className="h-8 w-8"
            aria-label="Skip forward 30 seconds"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Playback Speed */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlaybackRateChange}
          className="h-7 text-xs font-medium px-2"
        >
          {playbackRate}x
        </Button>

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMuteToggle}
            className="h-8 w-8"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 accent-primary"
            aria-label="Volume"
          />
        </div>
      </div>

      {!isReady && (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Loading...
        </div>
      )}
    </div>
  );
};
