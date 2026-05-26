"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

const labels = {
  logoAlt: "SBD Global Shopping",
  searchPlaceholder: "Search or paste a product URL…",
  searchLabel: "Go to search",
  cartLabel: "Open cart",
  menuLabel: "Open menu",
  menuCloseLabel: "Close menu",
  navShop: "Shop",
  navCategories: "Categories",
  navShipments: "Shipments",
  navBlog: "Blog",
  navTrack: "Track order",
  dashboard: "My Account",
  signIn: "Sign in",
};

const navLinks = [
  { label: labels.navShop, href: "/" },
  { label: labels.navCategories, href: "/categories" },
  { label: labels.navShipments, href: "/shipments" },
  { label: labels.navBlog, href: "/blog" },
  { label: labels.navTrack, href: "/track" },
];

export function SBDHeaderMobile() {
  const { itemCount, openCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-paper border-b border-line">
        {/* Top row: logo + icons */}
        <div className="px-4 h-14 flex items-center gap-2">
          <Link
            href="/"
            aria-label={labels.logoAlt}
            className="flex items-center gap-1 mr-auto"
          >
            <span className="text-[18px] font-bold tracking-tight text-ink">
              SBD
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent mb-0.5" />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            aria-label={`${labels.cartLabel}${itemCount ? `, ${itemCount} items` : ""}`}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-ink cursor-pointer"
          >
            <Icon name="cart" size={22} />
            {itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-accent text-paper text-[10px] font-bold leading-4 rounded-full text-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            aria-label={menuOpen ? labels.menuCloseLabel : labels.menuLabel}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-ink cursor-pointer"
          >
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>

        {/* Search row */}
        <div className="px-4 pb-3">
          <div
            className="relative"
            onClick={() => { router.push("/search"); setMenuOpen(false); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push("/search"); }}
            role="button"
            tabIndex={0}
            aria-label={labels.searchLabel}
          >
            <input
              type="text"
              placeholder={labels.searchPlaceholder}
              readOnly
              tabIndex={-1}
              className={cn(
                "w-full h-10 pl-4 pr-10 rounded-xl border border-line bg-bg",
                "text-[13px] text-muted cursor-pointer pointer-events-none",
                "focus:outline-none focus:border-ink focus:bg-paper"
              )}
            />
            <Icon
              name="search"
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <nav
            className="border-t border-line bg-paper px-4 py-3"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-0.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center h-11 px-3 rounded-xl text-[15px] font-medium text-ink hover:bg-bg transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-1 mt-1 border-t border-line">
                <Link
                  href={user ? "/dashboard" : "/login"}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center h-11 px-3 rounded-xl text-[15px] font-medium text-ink hover:bg-bg transition-colors"
                >
                  {user ? labels.dashboard : labels.signIn}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
