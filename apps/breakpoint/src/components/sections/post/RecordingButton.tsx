"use client";

import { useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
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
  const t = useTranslations("breakpoint.post");
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        label={label}
        onClick={() => setOpen(true)}
        iconLeft={<span aria-hidden="true">▶</span>}
      />
      <Button
        variant="inline"
        arrow
        href={`https://www.youtube.com/watch?v=${videoId}`}
        label={t("watchOnYouTube")}
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
