"use client";

import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { CartDrawer } from "@/components/layout/CartDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </UserProvider>
  );
}
