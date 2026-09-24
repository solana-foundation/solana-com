import type { Metadata } from "next";
import Link from "next/link";
import styles from "../scholars.module.css";
import ApplyForm from "./ApplyForm";

export const metadata: Metadata = {
  title: "Apply — Solana Scholars",
  description:
    "Apply to Solana Scholars, a research internship program for PhD students. No deadline — applications are accepted throughout the year.",
};

export default function ScholarsApplyPage() {
  return (
    <main className={styles.page}>
      <header className={`${styles.hero} ${styles.applyHero}`}>
        <p className={styles.eyebrow}>
          Application · PhD students · Open year-round
        </p>
        <h1 className={styles.titleSmall}>
          Apply to <span className={styles.grad}>Solana Scholars.</span>
        </h1>
        <p className={styles.intro}>
          Applications are short — we care about your ideas and your fit, not
          paperwork. There is no deadline; we accept applications throughout the
          year.
        </p>
        <Link className={styles.programLink} href="/scholars">
          <span className={styles.programLinkLabel}>
            Read about the program first
          </span>
          <span aria-hidden="true" className={styles.programLinkArrow}>
            →
          </span>
        </Link>
      </header>
      <ApplyForm />
    </main>
  );
}
