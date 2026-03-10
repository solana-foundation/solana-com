"use client";

import {
  FormEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

type Step = "email" | "code";

function SolanaLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.87}
      viewBox="0 0 101 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z"
        fill="url(#solana_login_grad)"
      />
      <defs>
        <linearGradient
          id="solana_login_grad"
          x1="8.52558"
          y1="90.0973"
          x2="88.9933"
          y2="-3.01622"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.08" stopColor="#9945FF" />
          <stop offset="0.3" stopColor="#8752F3" />
          <stop offset="0.5" stopColor="#5497D5" />
          <stop offset="0.6" stopColor="#43B4CA" />
          <stop offset="0.72" stopColor="#28E0B9" />
          <stop offset="0.97" stopColor="#19FB9B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="login-spinner"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="28"
        strokeDashoffset="8"
        opacity="0.8"
      />
    </svg>
  );
}

const DIGIT_COUNT = 6;

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(""));
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Keystatic redirects localhost → 127.0.0.1 (RedirectToLoopback).
    // Ensure login and cookies use the same domain to avoid cookie loss.
    if (window.location.hostname === "localhost") {
      window.location.href = window.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
      return;
    }
    setMounted(true);
  }, []);

  // Sync digits array → code string
  useEffect(() => {
    setCode(digits.join(""));
  }, [digits]);

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const sanitized = value.replace(/\D/g, "");
      if (!sanitized) return;

      const newDigits = [...digits];
      newDigits[index] = sanitized[0];
      setDigits(newDigits);

      // Auto-advance to next input
      if (index < DIGIT_COUNT - 1) {
        digitRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  const handleDigitKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (digits[index]) {
          const newDigits = [...digits];
          newDigits[index] = "";
          setDigits(newDigits);
        } else if (index > 0) {
          const newDigits = [...digits];
          newDigits[index - 1] = "";
          setDigits(newDigits);
          digitRefs.current[index - 1]?.focus();
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && index > 0) {
        digitRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < DIGIT_COUNT - 1) {
        digitRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newDigits = Array(DIGIT_COUNT).fill("");
    for (let i = 0; i < Math.min(pasted.length, DIGIT_COUNT); i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    // Focus last filled or the last input
    const lastIndex = Math.min(pasted.length, DIGIT_COUNT) - 1;
    digitRefs.current[lastIndex]?.focus();
  }, []);

  async function handleSendCode(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send code");
        return;
      }

      setStep("code");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Invalid code");
        return;
      }

      window.location.href = "/keystatic";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Focus first digit input when switching to code step
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => digitRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const codeComplete = code.length === DIGIT_COUNT;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --nd-bg: #000000;
          --nd-high-em: #FFFFFF;
          --nd-mid-em: #ABABBA;
          --nd-low-em: #6B6B7B;
          --nd-border: rgba(236, 228, 253, 0.12);
          --nd-border-prominent: rgba(236, 228, 253, 0.20);
          --nd-surface: rgba(255, 255, 255, 0.03);
          --nd-surface-hover: rgba(255, 255, 255, 0.06);
          --nd-accent: #CA9FF5;
          --nd-error: #F04438;
          --nd-error-bg: rgba(240, 68, 56, 0.08);
          --nd-error-border: rgba(240, 68, 56, 0.15);
        }

        body {
          background: var(--nd-bg);
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, -50px) scale(1.08); }
          50% { transform: translate(-40px, 60px) scale(0.96); }
          75% { transform: translate(-70px, -30px) scale(1.04); }
        }

        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-60px, 40px) scale(1.06); }
          50% { transform: translate(50px, -60px) scale(1.08); }
          75% { transform: translate(40px, 50px) scale(0.94); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .login-spinner { animation: spin 1s linear infinite; }

        .login-page {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--nd-bg);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--nd-high-em);
        }

        /* Background orbs — quieter, more diffuse */
        .login-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .login-bg__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
        }

        .login-bg__orb--purple {
          top: 5%;
          left: 10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(153, 69, 255, 0.08) 0%, transparent 70%);
          animation: drift1 25s ease-in-out infinite;
        }

        .login-bg__orb--teal {
          bottom: 0;
          right: 5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(67, 180, 202, 0.06) 0%, transparent 70%);
          animation: drift2 30s ease-in-out infinite;
        }

        /* Grid overlay */
        .login-bg__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* Card container */
        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 0 20px;
        }

        .login-card__inner {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--nd-border);
          border-radius: 16px;
          padding: 48px 40px 40px;
        }

        /* Staggered fade-in */
        .login-animate {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .login-animate--d1 { animation-delay: 0.05s; }
        .login-animate--d2 { animation-delay: 0.12s; }
        .login-animate--d3 { animation-delay: 0.20s; }
        .login-animate--d4 { animation-delay: 0.28s; }
        .login-animate--d5 { animation-delay: 0.36s; }

        /* Header */
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }

        .login-header__logo {
          margin-bottom: 24px;
        }

        .login-header__title {
          font-size: 32px;
          font-weight: 500;
          letter-spacing: -1.28px;
          line-height: 1.1;
          color: var(--nd-high-em);
          margin-bottom: 8px;
        }

        .login-header__subtitle {
          font-size: 15px;
          font-weight: 400;
          color: var(--nd-mid-em);
          letter-spacing: -0.15px;
          line-height: 1.4;
        }

        /* Error */
        .login-error {
          margin-bottom: 24px;
          padding: 12px 16px;
          border-radius: 10px;
          background: var(--nd-error-bg);
          border: 1px solid var(--nd-error-border);
          font-size: 13px;
          font-weight: 400;
          color: #FF6B6B;
          line-height: 1.5;
          animation: fadeInUp 0.3s ease-out;
        }

        /* Form label */
        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--nd-mid-em);
          margin-bottom: 10px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        /* Email input */
        .login-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid var(--nd-border);
          background: var(--nd-surface);
          color: var(--nd-high-em);
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          margin-bottom: 24px;
        }

        .login-input::placeholder {
          color: var(--nd-low-em);
        }

        .login-input:focus {
          border-color: var(--nd-border-prominent);
          box-shadow: 0 0 0 3px rgba(202, 159, 245, 0.08);
        }

        .login-input:disabled {
          opacity: 0.4;
        }

        /* Primary button — white on black, solutions style */
        .login-btn-primary {
          width: 100%;
          padding: 14px 24px;
          border-radius: 9999px;
          border: none;
          background: var(--nd-high-em);
          color: var(--nd-bg);
          font-size: 15px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
          letter-spacing: -0.15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-btn-primary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.88);
          transform: translateY(-1px);
        }

        .login-btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn-primary:disabled {
          background: rgba(255, 255, 255, 0.08);
          color: var(--nd-low-em);
          cursor: not-allowed;
        }

        .login-btn-primary--loading {
          background: rgba(255, 255, 255, 0.15);
          color: var(--nd-mid-em);
          cursor: wait;
        }

        /* Code step elements */
        .login-code-sent {
          font-size: 14px;
          color: var(--nd-mid-em);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .login-code-sent__email {
          color: var(--nd-accent);
          font-weight: 500;
        }

        /* Digit inputs */
        .login-digits {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          justify-content: center;
        }

        .login-digit {
          width: 52px;
          height: 60px;
          border-radius: 10px;
          border: 1px solid var(--nd-border);
          background: var(--nd-surface);
          color: var(--nd-high-em);
          font-size: 22px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          text-align: center;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          caret-color: var(--nd-accent);
        }

        .login-digit:focus {
          border-color: var(--nd-accent);
          box-shadow: 0 0 0 3px rgba(202, 159, 245, 0.12);
        }

        .login-digit--filled {
          border-color: var(--nd-border-prominent);
          background: var(--nd-surface-hover);
        }

        .login-digit:disabled {
          opacity: 0.4;
        }

        /* Back button */
        .login-btn-back {
          width: 100%;
          margin-top: 16px;
          padding: 10px;
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 400;
          color: var(--nd-low-em);
          cursor: pointer;
          font-family: inherit;
          transition: color 0.2s ease;
          letter-spacing: -0.13px;
        }

        .login-btn-back:hover {
          color: var(--nd-mid-em);
        }

        /* Footer */
        .login-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--nd-border);
          text-align: center;
        }

        .login-footer__text {
          font-size: 11px;
          font-weight: 500;
          color: var(--nd-low-em);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-card__inner {
            padding: 40px 24px 32px;
          }

          .login-header__title {
            font-size: 26px;
            letter-spacing: -1px;
          }

          .login-digit {
            width: 44px;
            height: 52px;
            font-size: 20px;
          }

          .login-digits {
            gap: 6px;
          }
        }
      `}</style>

      <div className="login-page">
        {/* Background */}
        <div className="login-bg">
          <div className="login-bg__orb login-bg__orb--purple" />
          <div className="login-bg__orb login-bg__orb--teal" />
          <div className="login-bg__grid" />
        </div>

        {/* Card */}
        <div
          className="login-card"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease" }}
        >
          <div className="login-card__inner">
            {/* Header */}
            <div
              className={`login-header ${mounted ? "login-animate login-animate--d1" : ""}`}
            >
              <div className="login-header__logo">
                <SolanaLogo size={44} />
              </div>
              <h1 className="login-header__title">Solana Media</h1>
              <p className="login-header__subtitle">
                {step === "email"
                  ? "Sign in to the CMS dashboard"
                  : "Enter the verification code"}
              </p>
            </div>

            {/* Error */}
            {error && <div className="login-error">{error}</div>}

            {/* Email step */}
            {step === "email" ? (
              <form onSubmit={handleSendCode}>
                <div
                  className={mounted ? "login-animate login-animate--d3" : ""}
                >
                  <label htmlFor="email" className="login-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="login-input"
                  />
                </div>
                <div
                  className={mounted ? "login-animate login-animate--d4" : ""}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className={`login-btn-primary ${loading ? "login-btn-primary--loading" : ""}`}
                  >
                    {loading && <Spinner />}
                    {loading ? "Sending code..." : "Continue with email"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode}>
                <div
                  className={mounted ? "login-animate login-animate--d2" : ""}
                >
                  <p className="login-code-sent">
                    Code sent to{" "}
                    <span className="login-code-sent__email">{email}</span>
                  </p>
                </div>

                {/* Digit boxes */}
                <div
                  className={`login-digits ${mounted ? "login-animate login-animate--d3" : ""}`}
                >
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        digitRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      disabled={loading}
                      className={`login-digit ${digit ? "login-digit--filled" : ""}`}
                    />
                  ))}
                </div>

                {/* Hidden real input for form validation */}
                <input
                  type="hidden"
                  name="code"
                  value={code}
                  required
                  pattern="[0-9]{6}"
                />

                <div
                  className={mounted ? "login-animate login-animate--d4" : ""}
                >
                  <button
                    type="submit"
                    disabled={loading || !codeComplete}
                    className={`login-btn-primary ${loading ? "login-btn-primary--loading" : ""}`}
                  >
                    {loading && <Spinner />}
                    {loading ? "Verifying..." : "Sign in"}
                  </button>
                </div>

                <div
                  className={mounted ? "login-animate login-animate--d5" : ""}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setDigits(Array(DIGIT_COUNT).fill(""));
                      setError("");
                    }}
                    className="login-btn-back"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div
              className={`login-footer ${mounted ? "login-animate login-animate--d5" : ""}`}
            >
              <span className="login-footer__text">Keystatic CMS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
