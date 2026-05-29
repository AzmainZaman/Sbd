"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { sendOtpForSignup, verifyOtpAndSetName } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

const labels = {
  heading: "Create your account",
  sub: "Start tracking global shipments and get personalised quotes.",
  nameLabel: "Full name",
  namePlaceholder: "Jane Smith",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  sendCode: "Continue",
  sending: "Sending…",
  otpHeading: "Verify your email",
  otpSub: (email: string) => `We sent a 6-digit code to ${email}`,
  otpLabel: "One-time code",
  otpPlaceholder: "123456",
  verify: "Create account",
  verifying: "Creating account…",
  changeEmail: "Use a different email",
  resend: "Resend code",
  hasAccount: "Already have an account?",
  signIn: "Sign in",
  orDivider: "or",
  googleLabel: "Continue with Google",
};

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors";

type Step = "details" | "otp";

export function SignupClient({ next }: { next?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await sendOtpForSignup(email.trim(), name.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setStep("otp");
      }
    });
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await verifyOtpAndSetName(email.trim(), token.trim(), name.trim());
      if (result.error) {
        setError(result.error);
      } else {
        router.push(next ?? "/dashboard");
        router.refresh();
      }
    });
  }

  function handleResend() {
    setError("");
    setToken("");
    startTransition(async () => {
      const result = await sendOtpForSignup(email.trim(), name.trim());
      if (result.error) setError(result.error);
    });
  }

  async function handleGoogleSignUp() {
    setIsGooglePending(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
      },
    });
    if (err) {
      setError(err.message);
      setIsGooglePending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-8">
      {step === "details" ? (
        <>
          <h1 className="text-[22px] font-semibold text-[var(--ink)] mb-1">
            {labels.heading}
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-6">{labels.sub}</p>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGooglePending || isPending}
            className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] font-medium text-[var(--ink)] hover:bg-[var(--bg)] transition-colors disabled:opacity-40 cursor-pointer mb-4"
          >
            <GoogleIcon />
            {isGooglePending ? "Redirecting…" : labels.googleLabel}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="flex-1 h-px bg-[var(--line)]" />
            <span className="text-[12px] text-[var(--muted)]">{labels.orDivider}</span>
            <span className="flex-1 h-px bg-[var(--line)]" />
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
              >
                {labels.nameLabel}
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoFocus
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={labels.namePlaceholder}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
              >
                {labels.emailLabel}
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={labels.emailPlaceholder}
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-[13px]" style={{ color: "var(--accent)" }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isPending || isGooglePending || !name.trim() || !email.trim()}
            >
              {isPending ? labels.sending : labels.sendCode}
            </Button>
          </form>

          <p className="mt-5 text-center text-[13px] text-[var(--muted)]">
            {labels.hasAccount}{" "}
            <Link
              href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-[var(--ink)] font-medium hover:underline"
            >
              {labels.signIn}
            </Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-[22px] font-semibold text-[var(--ink)] mb-1">
            {labels.otpHeading}
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-6">
            {labels.otpSub(email)}
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="signup-otp"
                className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
              >
                {labels.otpLabel}
              </label>
              <input
                id="signup-otp"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                autoComplete="one-time-code"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder={labels.otpPlaceholder}
                className={`${inputClass} font-mono tracking-[0.25em] text-center`}
              />
            </div>

            {error && (
              <p className="text-[13px]" style={{ color: "var(--accent)" }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isPending || token.length < 6}
            >
              {isPending ? labels.verifying : labels.verify}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-4 text-[13px]">
            <button
              type="button"
              onClick={() => { setStep("details"); setError(""); setToken(""); }}
              className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              {labels.changeEmail}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isPending}
              className="text-[var(--muted)] hover:text-[var(--ink)] transition-colors disabled:opacity-40"
            >
              {labels.resend}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
