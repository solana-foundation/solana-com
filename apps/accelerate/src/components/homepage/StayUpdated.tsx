"use client";

import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePath } from "@/config";

const ITERABLE_BASE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=";

// Placeholder form ID - replace with actual Iterable form ID
const ITERABLE_FORM_ID = "PLACEHOLDER_FORM_ID";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StayUpdated() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      if (!EMAIL_REGEX.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }

      if (!consent) {
        setErrorMsg("Please accept the privacy policy to continue.");
        return;
      }

      setStatus("submitting");

      try {
        const data = new FormData();
        data.append("email", email);

        const response = await fetch(
          `${ITERABLE_BASE_URL}${ITERABLE_FORM_ID}`,
          {
            method: "POST",
            body: data,
          },
        );

        if (!response.ok) {
          throw new Error("Subscription failed");
        }

        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    },
    [email, consent],
  );

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  return (
    <section className="relative bg-black py-16 lg:py-24">
      {/* Background hero image (inverted, for ambiance) */}
      <div className="pointer-events-none absolute inset-0 -scale-y-100 opacity-50">
        <Image
          src={getImagePath("/images/homepage/acc-hero-bg.png")}
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 84.583%, #000000 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[616px] flex-col items-center gap-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-10"
        >
          <div className="flex w-[586px] max-w-full flex-col gap-10 text-center">
            {/* Heading - Space Grotesk Light 50px */}
            <h2
              className="text-[32px] font-light uppercase tracking-[2.5px] text-[#b3b2bc] md:text-[42px] lg:text-[50px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                lineHeight: 1,
              }}
            >
              Stay Updated
            </h2>
            {/* Subtitle - ABC Diatype Light 24px */}
            <p
              className="text-[18px] leading-[1.2] text-[#d2d2d2] md:text-[24px]"
              style={{
                fontFamily: "'ABC Diatype', sans-serif",
                fontWeight: 300,
              }}
            >
              Be the first to know about speaker announcements,
              <br />
              schedule releases, and exclusive offers.
            </p>
          </div>

          {status === "success" ? (
            <p className="text-[18px] text-[#19fb9b]">
              Thanks for subscribing! We&apos;ll keep you updated.
            </p>
          ) : (
            <>
              {/* Email input + subscribe button - rounded pill */}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex w-full flex-col items-stretch gap-4 rounded-[32px] border border-[#8d8d8d] p-4 md:flex-row md:items-center md:justify-between md:rounded-[66px]">
                  <div className="flex items-center justify-center p-2.5">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full bg-transparent text-[16px] font-medium uppercase tracking-[0.8px] text-white placeholder-white outline-none"
                      style={{
                        fontFamily:
                          "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        lineHeight: 1,
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex h-[48px] items-center justify-center rounded-[32px] border border-[#3d3d3d] px-7 py-6 text-center transition-colors hover:border-white/40 disabled:opacity-50 md:min-w-[240px]"
                  >
                    <span
                      className="text-[18px] font-semibold uppercase tracking-[0.9px] text-[#3d3d3d]"
                      style={{
                        fontFamily:
                          "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {status === "submitting" ? "..." : "Subscribe"}
                    </span>
                  </button>
                </div>

                {/* Consent checkbox */}
                <div className="mt-6 flex w-[445px] max-w-full items-start gap-[11px] self-center">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0 h-[22px] w-[22px] flex-shrink-0 cursor-pointer rounded-none border border-[#8d8d8d] bg-black"
                  />
                  <p
                    className="text-left text-[16px] tracking-[0.8px] text-[#8d8d8d]"
                    style={{
                      fontFamily: "'ABC Diatype', sans-serif",
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    I consent to my information being collected in accordance
                    with the Solana{" "}
                    <a
                      href="https://solana.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline transition-colors hover:text-white"
                    >
                      privacy policy
                    </a>
                  </p>
                </div>

                {errorMsg && (
                  <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
                )}
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
