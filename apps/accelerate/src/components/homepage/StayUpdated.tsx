"use client";

import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";

const ITERABLE_BASE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=";

const ITERABLE_FORM_ID = "fdd4a0db-f4af-4b29-90f9-98b0556d4c89";

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
      <div className="relative z-10 mx-auto flex max-w-[616px] flex-col items-center gap-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-10"
        >
          <div className="flex w-[345px] max-w-full flex-col gap-6 text-center md:w-[586px] md:gap-10">
            {/* Heading */}
            <h2 className="text-[29px] font-light uppercase leading-none tracking-[1.5px] text-accelerate-gray-100 md:text-[42px] lg:text-[50px]">
              Stay Updated
            </h2>
            {/* Subtitle */}
            <p className="font-diatype text-[18px] font-light leading-[1.2] text-accelerate-gray-light md:text-[24px]">
              Be the first to know about speaker announcements, schedule
              releases, and exclusive offers.
            </p>
          </div>

          {status === "success" ? (
            <p className="text-[18px] text-accelerate-green">
              Thanks for subscribing! We&apos;ll keep you updated.
            </p>
          ) : (
            <>
              {/* Email input + subscribe button */}
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-[296px] md:max-w-full"
              >
                <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between md:gap-0 md:rounded-[66px] md:border md:border-accelerate-gray-200 md:p-4">
                  {/* Email input - separate pill on mobile */}
                  <div className="flex h-[48px] items-center justify-center rounded-[39px] border border-accelerate-gray-200 px-4 md:border-0 md:p-2.5">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full bg-transparent text-center text-[13px] font-medium uppercase tracking-[0.65px] leading-none text-white placeholder-white outline-none md:text-left md:text-[16px] md:tracking-[0.8px]"
                    />
                  </div>
                  {/* Subscribe button - separate pill on mobile */}
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex h-[48px] items-center justify-center rounded-[32px] border border-accelerate-gray-dark px-5 py-[17.5px] text-center transition-colors hover:border-white/40 disabled:opacity-50 md:min-w-[240px] md:px-7 md:py-6"
                  >
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.48px] leading-none text-accelerate-gray-dark md:text-[18px] md:tracking-[0.9px]">
                      {status === "submitting" ? "..." : "Subscribe"}
                    </span>
                  </button>
                </div>

                {/* Consent checkbox */}
                <div className="mx-auto mt-8 flex max-w-full items-start gap-3 md:mt-6 md:w-[445px]">
                  <div className="flex items-center py-[2px]">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0 h-[19px] w-[19px] flex-shrink-0 cursor-pointer rounded-none border border-accelerate-gray-200 bg-black md:h-[22px] md:w-[22px]"
                    />
                  </div>
                  <p className="font-diatype text-left text-[12px] font-light leading-none tracking-[0.6px] text-accelerate-gray-200 md:text-[16px] md:tracking-[0.8px]">
                    I consent to my information being collected in accordance
                    with the Solana{" "}
                    <a
                      href="https://solana.com/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline transition-colors hover:text-white"
                    >
                      Privacy policy
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
