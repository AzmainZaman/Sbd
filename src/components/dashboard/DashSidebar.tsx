"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { signOut } from "@/actions/auth";

const nav: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/dashboard", icon: "home" },
  { label: "My Orders", href: "/dashboard/orders", icon: "package" },
  { label: "My Quotes", href: "/dashboard/quotes", icon: "tag" },
  { label: "Addresses", href: "/dashboard/addresses", icon: "map-pin" },
];

const labels = {
  memberTier: "Gold member",
  accountSettings: "Account settings",
  signOut: "Sign out",
};

function deriveInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashSidebar() {
  const pathname = usePathname();
  const { user, role } = useUser();

  const displayName =
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    null;
  const initials = deriveInitials(displayName);

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-line bg-paper">
      {/* User info */}
      <div className="px-5 py-6 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-ink">
            <span className="text-[13px] font-semibold text-paper">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink truncate">
              {displayName ?? "—"}
            </p>
            <p className="text-[12px] text-muted">{labels.memberTier}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-ink text-paper"
                  : "text-muted hover:bg-bg hover:text-ink"
              )}
            >
              <Icon
                name={item.icon}
                size={18}
                strokeWidth={isActive ? 2 : 1.5}
              />
              {item.label}
            </Link>
          );
        })}

        {/* Account settings */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-ink text-paper"
              : "text-muted hover:bg-bg hover:text-ink"
          )}
        >
          <Icon
            name="settings"
            size={18}
            strokeWidth={pathname === "/dashboard/settings" ? 2 : 1.5}
          />
          {labels.accountSettings}
        </Link>
      </nav>

      {/* Admin panel link — only for admin users */}
      {role === "admin" && (
        <div className="px-3 pb-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-muted hover:bg-bg hover:text-ink transition-colors"
          >
            <Icon name="settings" size={18} strokeWidth={1.5} />
            Admin panel
          </Link>
        </div>
      )}

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-line">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-muted hover:bg-bg hover:text-ink transition-colors cursor-pointer"
          >
            <Icon name="logout" size={18} strokeWidth={1.5} />
            {labels.signOut}
          </button>
        </form>
      </div>
    </aside>
  );
}
