"use client";

import { useState } from "react";
import Button from "@/components/Button";
import YouTubeModal from "@/components/YouTubeModal";

export default function RecordingButton({
  videoId,
  label,
  title,
}: {
  videoId: string;
  label: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        label={label}
        onClick={() => setOpen(true)}
        iconLeft={<span aria-hidden="true">▶</span>}
      />
      <YouTubeModal
        open={open}
        onClose={() => setOpen(false)}
        videoId={videoId}
        title={title}
      />
    </>
  );
}
