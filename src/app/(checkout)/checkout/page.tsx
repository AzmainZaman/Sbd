"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartLines } from "@/components/checkout/CartLines";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShipmentNote } from "@/components/checkout/ShipmentNote";
import { DeliveryOptions } from "@/components/checkout/DeliveryOptions";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { ConsentBlock } from "@/components/checkout/ConsentBlock";
import { Button } from "@/components/ui/Button";
import type { PaymentMethod } from "@/types/order";

const labels = {
  emptyHeading: "Your cart is empty",
  emptyBody: "Add some products before checking out.",
  continueShopping: "Continue shopping",
  yourOrder: "Your order",
  deliveryAddress: "Delivery address",
  editAddress: "Edit",
  addressPlaceholder: "48 Gulshan Avenue, Apt 7B\nGulshan-2, Dhaka 1212",
  addressNote: "Address management available after sign-in (Phase 2).",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalBDT, itemCount, clearItems } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<"split" | "together">("together");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [agreed, setAgreed] = useState(false);

  const hasPreOrder = items.some((i) => i.type === "pre-order");
  const hasInStock = items.some((i) => i.type === "in-stock");
  const isMixed = hasPreOrder && hasInStock;

  // First pre-order item's shipment/ETA info for ShipmentNote
  const preOrderItem = items.find((i) => i.type === "pre-order");
  const preOrderEta = preOrderItem?.eta;
  const preOrderShipmentId = preOrderItem?.shipmentId;

  function handlePlaceOrder() {
    const mockId = `SBD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const params = new URLSearchParams({ id: mockId });
    if (hasInStock) params.set("stock", "1");
    if (hasPreOrder) {
      params.set("pre", "1");
      if (preOrderEta) params.set("preEta", preOrderEta);
      if (preOrderShipmentId) params.set("shipmentId", preOrderShipmentId);
    }
    clearItems();
    router.push(`/order-confirmation?${params.toString()}`);
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-[20px] font-semibold text-ink mb-2">{labels.emptyHeading}</p>
        <p className="text-[14px] text-muted mb-6">{labels.emptyBody}</p>
        <Link href="/">
          <Button variant="primary" size="md">{labels.continueShopping}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">

        {/* ── Left column ── */}
        <div className="lg:col-span-7 space-y-8">

          {/* Your order */}
          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-4">{labels.yourOrder}</h2>
            <CartLines />
          </section>

          {/* Delivery address */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-semibold text-ink">{labels.deliveryAddress}</h2>
              <button
                type="button"
                className="text-[13px] text-muted hover:text-ink transition-colors cursor-pointer"
                aria-label="Edit delivery address"
              >
                {labels.editAddress}
              </button>
            </div>
            <div className="rounded-xl border border-line bg-paper px-4 py-3">
              <p className="text-[14px] text-ink whitespace-pre-line">{labels.addressPlaceholder}</p>
              <p className="text-[11px] text-muted mt-2">{labels.addressNote}</p>
            </div>
          </section>

          {/* Delivery options — only for mixed carts */}
          {isMixed && (
            <section>
              <DeliveryOptions value={deliveryMethod} onChange={setDeliveryMethod} />
            </section>
          )}

          {/* Payment method */}
          <section>
            <PaymentSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              hasPreOrder={hasPreOrder}
            />
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-5 mt-8 lg:mt-0 lg:sticky lg:top-6 space-y-4">
          <OrderSummary subtotalBDT={subtotalBDT} itemCount={itemCount} />

          {hasPreOrder && (
            <ShipmentNote shipmentId={preOrderShipmentId} eta={preOrderEta} />
          )}

          <ConsentBlock
            agreed={agreed}
            onAgreedChange={setAgreed}
            paymentSelected={paymentMethod !== null}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
}
