import { getProfile } from "@/actions/profile";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Account settings — SBD" };

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-[22px] font-semibold text-ink mb-6">Account settings</h1>
      <SettingsClient profile={profile} />
    </div>
  );
}
