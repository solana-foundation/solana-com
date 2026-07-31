"use client";

import { useState, type FormEvent } from "react";
import styles from "../scholars.module.css";

/**
 * Applications are appended as rows to a Google Sheet via a Google Apps
 * Script web app (see google-apps-script/Code.gs in this package for the
 * script and its 3-minute setup). To change where applications land,
 * redeploy the script and update this URL.
 */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwiG9GVMX2F14y8pDcvCmdYm3MYVrWuHV5hHoi5u_5wyUekJTIYMj3UqQEn7eiwuOb7ug/exec";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function ApplyForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      // Content-Type text/plain keeps this a "simple" CORS request,
      // which Google Apps Script accepts cross-origin without preflight.
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || "Submission failed");
      setStatus({ kind: "success" });
    } catch {
      setStatus({
        kind: "error",
        message: "Something went wrong. Please try again in a moment.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className={styles.formSuccess} role="status">
        <strong>Application received — thank you!</strong>
        <p>We read everything, and we&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formRowTwo}>
        <div className={styles.field}>
          <label htmlFor="sch-name">Full name</label>
          <input
            id="sch-name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="sch-email">Email</label>
          <input
            id="sch-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="sch-address">
            Full address{" "}
            <span className={styles.optional}>
              — street, postal code, city, country
            </span>
          </label>
          <textarea
            id="sch-address"
            name="address"
            rows={2}
            autoComplete="street-address"
            required
          />
        </div>
      </div>

      <div className={styles.formRowTwo}>
        <div className={styles.field}>
          <label htmlFor="sch-institution">Institution &amp; PhD program</label>
          <input id="sch-institution" name="institution" type="text" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="sch-advisor">Advisor</label>
          <input id="sch-advisor" name="advisor" type="text" required />
        </div>
      </div>

      <div className={styles.formRowTwo}>
        <div className={styles.field}>
          <label htmlFor="sch-format">Preferred format</label>
          <select id="sch-format" name="format" required defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option>On-site — Zurich, Switzerland</option>
            <option>On-site — New York, USA</option>
            <option>Virtual</option>
            <option>Flexible / not sure yet</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="sch-background">
            Research background &amp; interests{" "}
            <span className={styles.optional}>
              — a few sentences, your publications, or a link to your homepage /
              CV
            </span>
          </label>
          <textarea id="sch-background" name="background" rows={4} required />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="sch-topic">
            What do you want to study? Why? How?{" "}
            <span className={styles.optional}>
              — a short pitch: the question, why it matters, and how you&apos;d
              approach it
            </span>
          </label>
          <textarea id="sch-topic" name="topic" rows={6} required />
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          className={styles.btn}
          type="submit"
          disabled={status.kind === "submitting"}
        >
          {status.kind === "submitting" ? "Submitting…" : "Submit application"}
        </button>
        <span
          className={status.kind === "error" ? styles.noteError : styles.note}
          role="status"
        >
          {status.kind === "error" ? status.message : "We read everything."}
        </span>
      </div>
    </form>
  );
}
