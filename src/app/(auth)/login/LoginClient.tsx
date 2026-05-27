"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { sendOtp, verifyOtp } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

const labels = {
  emailHeading: "Sign in to your account",
  emailSub: "We'll send a one-time code to your email.",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  sendCode: "Send code",
  sending: "Sending…",
  otpHeading: "Check your email",
  otpSub: (email: string) => `We sent a 6-digit code to ${email}`,
  otpLabel: "One-time code",
  otpPlaceholder: "123456",
  verify: "Sign in",
  verifying: "Verifying…",
  changeEmail: "Use a different email",
  resend: "Resend code",
};

const inputClass =
  "w-full h-11 px-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition-colors";

type Step = "email" | "otp";

export function LoginClient({ next }: { next?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") ?? params.get("token_hash");
    if (!code) return;

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error: err }) => {
      if (err) return;
      router.replace(next ?? "/dashboard");
    });
  }, [next, router]);

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await sendOtp(email.trim());
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
      const result = await verifyOtp(email.trim(), token.trim());
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
      const result = await sendOtp(email.trim());
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-8">
      {step === "email" ? (
        <>
          <h1 className="text-[20px] font-semibold text-[var(--ink)] mb-1">
            {labels.emailHeading}
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-6">{labels.emailSub}</p>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
              >
                {labels.emailLabel}
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoFocus
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
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending || !email.trim()}
            >
              {isPending ? labels.sending : labels.sendCode}
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-[20px] font-semibold text-[var(--ink)] mb-1">
            {labels.otpHeading}
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-6">
            {labels.otpSub(email)}
          </p>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-otp"
                className="block text-[13px] font-medium text-[var(--ink)] mb-1.5"
              >
                {labels.otpLabel}
              </label>
              <input
                id="login-otp"
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
              variant="primary"
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
              onClick={() => { setStep("email"); setError(""); setToken(""); }}
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
