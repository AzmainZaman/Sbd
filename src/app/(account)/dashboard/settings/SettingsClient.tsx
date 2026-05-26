"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/actions/profile";
import type { Profile } from "@/actions/profile";

const labels = {
  heading: "Account settings",
  profileSection: "Profile",
  nameLabel: "Full name",
  namePlaceholder: "Your name",
  phoneLabel: "Phone number",
  phonePlaceholder: "e.g. +880 1700 000000",
  emailLabel: "Email address",
  emailNote: "To change your email, contact support.",
  save: "Save changes",
  saving: "Saving…",
  saved: "Saved",
  dangerSection: "Danger zone",
  deleteLabel: "Delete account",
  deleteNote: "To permanently delete your account and all associated data, email us and we will process your request within 48 hours.",
  deleteLink: "Request account deletion",
  supportEmail: "team@shob.ai",
};

const inputClass =
  "w-full h-10 px-3 rounded-xl border border-line bg-paper text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

export function SettingsClient({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await updateProfile(name, phone || null);
        setStatus("saved");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    });
  }

  return (
    <div className="max-w-xl space-y-10">

      {/* Profile */}
      <section>
        <h2 className="text-[15px] font-semibold text-ink mb-4">{labels.profileSection}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">{labels.nameLabel}</label>
            <input
              required
              value={name}
              onChange={(e) => { setName(e.target.value); setStatus("idle"); }}
              placeholder={labels.namePlaceholder}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">{labels.phoneLabel}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setStatus("idle"); }}
              placeholder={labels.phonePlaceholder}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-ink mb-1">{labels.emailLabel}</label>
            <input
              value={profile.email}
              readOnly
              className={`${inputClass} opacity-60 cursor-not-allowed bg-bg`}
            />
            <p className="text-[12px] text-muted mt-1">{labels.emailNote}</p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 rounded-xl bg-ink text-paper text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
            >
              {isPending ? labels.saving : labels.save}
            </button>
            {status === "saved" && (
              <span className="text-[13px] font-medium" style={{ color: "var(--ok)" }}>
                {labels.saved}
              </span>
            )}
            {status === "error" && (
              <span className="text-[13px]" style={{ color: "var(--accent)" }}>
                {errorMsg}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="border border-line rounded-xl p-5">
        <h2 className="text-[15px] font-semibold text-ink mb-1">{labels.dangerSection}</h2>
        <p className="text-[13px] text-muted mb-3">{labels.deleteNote}</p>
        <a
          href={`mailto:${labels.supportEmail}?subject=Account deletion request`}
          className="text-[13px] font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          {labels.deleteLink} →
        </a>
      </section>

    </div>
  );
}
