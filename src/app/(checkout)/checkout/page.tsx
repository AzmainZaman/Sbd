"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CartLines } from "@/components/checkout/CartLines";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShipmentNote } from "@/components/checkout/ShipmentNote";
import { DeliveryOptions } from "@/components/checkout/DeliveryOptions";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { ConsentBlock } from "@/components/checkout/ConsentBlock";
import { AddressSection } from "@/components/checkout/AddressSection";
import { Button } from "@/components/ui/Button";
import { createOrder } from "@/actions/orders";
import { getAddresses } from "@/actions/addresses";
import type { PaymentMethod } from "@/types/order";
import type { Address } from "@/types/address";

const labels = {
  emptyHeading: "Your cart is empty",
  emptyBody: "Add some products before checking out.",
  continueShopping: "Continue shopping",
  yourOrder: "Your order",
  deliveryAddress: "Delivery address",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalBDT, itemCount, clearItems } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"split" | "together">("together");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  useEffect(() => {
    getAddresses().then((list) => {
      setAddresses(list);
      const def = list.find((a) => a.isDefault) ?? list[0] ?? null;
      if (def) setSelectedAddressId(def.id);
    });
  }, []);

  const hasPreOrder = items.some((i) => i.type === "pre-order");
  const hasInStock = items.some((i) => i.type === "in-stock");
  const isMixed = hasPreOrder && hasInStock;

  const preOrderItem = items.find((i) => i.type === "pre-order");
  const preOrderEta = preOrderItem?.eta;
  const preOrderShipmentId = preOrderItem?.shipmentId;

  async function handlePlaceOrder() {
    if (!paymentMethod) return;
    setIsPlacing(true);
    setPlaceError(null);
    try {
      const { orderId } = await createOrder({
        items,
        deliveryMethod,
        paymentMethod,
        deliveryAddressId: selectedAddressId,
      });
      clearItems();
      router.push(`/order-confirmation?id=${orderId}`);
    } catch (err) {
      setPlaceError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsPlacing(false);
    }
  }

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
            <h2 className="text-[17px] font-semibold text-ink mb-4">{labels.deliveryAddress}</h2>
            <AddressSection
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />
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

          {placeError && (
            <p className="text-[13px] text-center" style={{ color: "var(--accent)" }}>
              {placeError}
            </p>
          )}
          <ConsentBlock
            agreed={agreed}
            onAgreedChange={setAgreed}
            paymentSelected={paymentMethod !== null}
            paymentMethod={paymentMethod}
            onPlaceOrder={handlePlaceOrder}
            isPlacing={isPlacing}
          />
        </div>
      </div>
    </div>
  );
}
