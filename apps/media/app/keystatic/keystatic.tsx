"use client";

import { upload } from "@vercel/blob/client";
import { makePage } from "@keystatic/next/ui/app";
import { usePathname } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import config from "../../keystatic.config";

const KeystaticPage = makePage(config);

// The library is a working shelf: its indigo tab stays quiet beside Keystatic's
// editor chrome, while the dialog puts file names and their reuse action first.

type ReportBlob = {
  pathname: string;
  size: number;
  uploadedAt: string;
  url: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ReportPdfManager() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blobs, setBlobs] = useState<ReportBlob[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadBlobs() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/keystatic/reports/blob", {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        blobs?: ReportBlob[];
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Unable to load PDFs.");
      setBlobs(data.blobs ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load PDFs.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) void loadBlobs();
  }, [isOpen]);

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("PDF URL copied. Paste it into the PDF URL field.");
  }

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
    setMessage(null);
    try {
      const blob = await upload(`reports/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/keystatic/reports/blob-upload",
      });
      await copyUrl(blob.url);
      await loadBlobs();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteBlob(blob: ReportBlob) {
    if (!window.confirm(`Delete ${blob.pathname}? This cannot be undone.`))
      return;

    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/keystatic/reports/blob", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pathname: blob.pathname }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to delete PDF.");
      setBlobs((current) =>
        current.filter((item) => item.pathname !== blob.pathname),
      );
      setMessage("PDF deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete PDF.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={managerButtonStyle}
      >
        Manage report PDFs
      </button>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Manage report PDFs"
          style={dialogBackdropStyle}
        >
          <section style={dialogStyle}>
            <div style={dialogHeaderStyle}>
              <div>
                <p style={eyebrowStyle}>Vercel Blob · reports/</p>
                <strong style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
                  Report PDF library
                </strong>
                <p style={subtleTextStyle}>
                  Upload a file or reuse a URL from the library.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={closeButtonStyle}
                aria-label="Close PDF library"
              >
                ×
              </button>
            </div>
            <div style={toolbarStyle}>
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
                style={primaryButtonStyle}
              >
                {isUploading ? "Uploading…" : "Upload PDF"}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void loadBlobs()}
                style={secondaryButtonStyle}
              >
                {isLoading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
            {message && <p style={successTextStyle}>{message}</p>}
            {error && <p style={errorTextStyle}>{error}</p>}
            <div style={listStyle}>
              {isLoading && blobs.length === 0 ? (
                <p style={subtleTextStyle}>Loading PDFs…</p>
              ) : null}
              {!isLoading && blobs.length === 0 ? (
                <p style={subtleTextStyle}>
                  No report PDFs yet. Upload the first one to add it here.
                </p>
              ) : null}
              {blobs.map((blob) => (
                <article key={blob.pathname} style={blobRowStyle}>
                  <div style={{ minWidth: 0 }}>
                    <a
                      href={blob.url}
                      target="_blank"
                      rel="noreferrer"
                      style={fileLinkStyle}
                    >
                      {blob.pathname.replace(/^reports\//, "")}
                    </a>
                    <p style={subtleTextStyle}>
                      {formatFileSize(blob.size)} ·{" "}
                      {new Date(blob.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={rowActionsStyle}>
                    <button
                      type="button"
                      onClick={() => void copyUrl(blob.url)}
                      style={secondaryButtonStyle}
                    >
                      Copy URL
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteBlob(blob)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

const managerButtonStyle = {
  background: "#3f65db",
  border: "1px solid #5275e8",
  borderRadius: "999px",
  boxShadow: "0 1px 2px rgb(0 0 0 / 18%)",
  color: "white",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 700,
  lineHeight: "20px",
  padding: "3px 9px",
  position: "fixed" as const,
  right: "24px",
  bottom: "24px",
  zIndex: 20,
};
const dialogBackdropStyle = {
  alignItems: "center",
  background: "rgb(15 23 42 / 48%)",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  padding: "24px",
  position: "fixed" as const,
  zIndex: 100,
};
const dialogStyle = {
  background: "#ffffff",
  border: "1px solid #c7d2fe",
  borderRadius: "12px",
  boxShadow: "0 24px 72px rgb(15 23 42 / 30%)",
  color: "#172554",
  maxHeight: "80vh",
  maxWidth: "720px",
  overflow: "auto",
  padding: "26px",
  width: "100%",
};
const dialogHeaderStyle = {
  alignItems: "flex-start",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
};
const toolbarStyle = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
  marginBottom: "12px",
};
const primaryButtonStyle = {
  background: "#312e81",
  border: 0,
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
  padding: "9px 12px",
};
const secondaryButtonStyle = {
  background: "#ffffff",
  border: "1px solid #c7d2fe",
  borderRadius: "6px",
  color: "#312e81",
  cursor: "pointer",
  fontWeight: 700,
  padding: "8px 10px",
};
const deleteButtonStyle = {
  background: "#ffffff",
  border: "1px solid #fecaca",
  borderRadius: "6px",
  color: "#b91c1c",
  cursor: "pointer",
  fontWeight: 700,
  padding: "8px 10px",
};
const closeButtonStyle = {
  background: "transparent",
  border: 0,
  color: "#4f46e5",
  cursor: "pointer",
  fontSize: "28px",
  lineHeight: 1,
  padding: 0,
};
const eyebrowStyle = {
  color: "#4f46e5",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};
const subtleTextStyle = {
  color: "#64748b",
  fontSize: "14px",
  margin: "4px 0 0",
};
const successTextStyle = {
  color: "#047857",
  fontSize: "14px",
  margin: "12px 0",
};
const errorTextStyle = { color: "#b91c1c", fontSize: "14px", margin: "12px 0" };
const listStyle = { borderTop: "1px solid #e0e7ff", marginTop: "16px" };
const blobRowStyle = {
  alignItems: "center",
  borderBottom: "1px solid #e0e7ff",
  display: "flex",
  gap: "16px",
  justifyContent: "space-between",
  padding: "14px 0",
};
const rowActionsStyle = { display: "flex", flexShrink: 0, gap: "8px" };
const fileLinkStyle = {
  color: "#3730a3",
  display: "block",
  fontSize: "14px",
  fontWeight: 700,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap" as const,
};

export default function KeystaticApp() {
  const pathname = usePathname();
  const isReportEditor = /\/collection\/reports\/(?:create|item\/)/.test(
    pathname,
  );

  return (
    <>
      {isReportEditor && <ReportPdfManager />}
      <KeystaticPage />
    </>
  );
}
