"use client";

import { upload } from "@vercel/blob/client";
import { makePage } from "@keystatic/next/ui/app";
import { usePathname } from "next/navigation";
import { type ChangeEvent, useRef, useState } from "react";
import config from "../../keystatic.config";

const KeystaticPage = makePage(config);

function ReportPdfUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Choose a PDF file.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUrl(null);

    try {
      const blob = await upload(`reports/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/keystatic/reports/blob-upload",
      });
      setUrl(blob.url);
      await navigator.clipboard.writeText(blob.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      style={{
        background: "#eefbf5",
        borderBottom: "1px solid #b7e4ce",
        color: "#123524",
        padding: "12px 20px",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleUpload}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        style={{
          background: "#123524",
          border: 0,
          borderRadius: "6px",
          color: "white",
          cursor: isUploading ? "wait" : "pointer",
          fontWeight: 600,
          padding: "8px 12px",
        }}
      >
        {isUploading ? "Uploading PDF…" : "Upload report PDF"}
      </button>
      <span style={{ fontSize: "14px", marginLeft: "10px" }}>
        Uploads to Vercel Blob; the URL is copied automatically.
      </span>
      {url && (
        <p style={{ fontSize: "14px", margin: "8px 0 0" }}>
          Uploaded. Paste the copied URL into this report’s PDF URL field.
        </p>
      )}
      {error && (
        <p style={{ color: "#b42318", fontSize: "14px", margin: "8px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function KeystaticApp() {
  const pathname = usePathname();
  const isReportEditor = pathname.includes("/collection/reports");

  return (
    <>
      {isReportEditor && <ReportPdfUploader />}
      <KeystaticPage />
    </>
  );
}
