"use client";

import Link from "next/link";
import { TopBar } from "./TopBar";
import { HeaderSearch } from "./HeaderSearch";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

const labels = {
  logoAlt: "SBD Global Shopping",
  navShop: "Shop",
  navCategories: "Categories",
  navShipments: "Shipments",
  navBlog: "Blog",
  navTrack: "Track order",
  cartLabel: "Open cart",
  accountLabel: "Account",
  signIn: "Sign in",
};

const navLinks = [
  { label: labels.navShop, href: "/" },
  { label: labels.navCategories, href: "/categories" },
  { label: labels.navShipments, href: "/shipments" },
  { label: labels.navBlog, href: "/blog" },
  { label: labels.navTrack, href: "/track" },
];

export function SBDHeader() {
  const { itemCount, openCart } = useCart();
  const { user } = useUser();
  const accountHref = user ? "/dashboard" : "/login";
  const accountLabel = user ? labels.accountLabel : labels.signIn;
  const userInitial = user?.email?.[0]?.toUpperCase() ?? null;

  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-line">
      <TopBar />

      {/* Main header row */}
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label={labels.logoAlt}
          className="flex items-center gap-1.5 shrink-0 mr-2"
        >
          <SBDLogoMark />
        </Link>

        {/* Search bar */}
        <HeaderSearch />

        {/* Nav links */}
        <nav
          className="hidden xl:flex items-center gap-0.5 text-[13px] font-medium"
          aria-label="Main navigation"
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-muted hover:text-ink hover:bg-bg transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Cart + Account */}
        <div className="flex items-center gap-1 ml-auto xl:ml-0">
          <button
            onClick={openCart}
            aria-label={`${labels.cartLabel}${itemCount ? `, ${itemCount} items` : ""}`}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-ink hover:bg-bg transition-colors cursor-pointer"
          >
            <Icon name="cart" size={20} />
            {itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-accent text-paper text-[10px] font-bold leading-4 rounded-full text-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
          <Link
            href={accountHref}
            aria-label={accountLabel}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-ink hover:bg-bg transition-colors"
          >
            {userInitial ? (
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold text-paper"
                style={{ backgroundColor: "var(--ink)" }}
              >
                {userInitial}
              </span>
            ) : (
              <Icon name="user" size={20} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function SBDLogoMark() {
  return (
    <span className="flex items-center gap-1">
      <span
        className="text-[20px] font-bold tracking-tight text-ink"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        SBD
      </span>
      <span className="w-2 h-2 rounded-full bg-accent mt-0.5" />
    </span>
  );
}
