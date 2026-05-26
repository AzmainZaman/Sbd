"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth-guard";
import { sendDeliveryEmail } from "@/lib/email";
import type { Order, OrderStatus, OrderLine, TrackingStep, PaymentMethod } from "@/types/order";

export type AdminOrder = Order & {
  customerName: string;
  customerEmail: string;
};

type DbOrder = {
  id: string;
  customer_id: string;
  placed_at: string;
  status: string;
  type: string;
  delivery_method: string;
  shipping_bdt: number;
  duty_bdt: number;
  handling_bdt: number;
  local_delivery_bdt: number;
  subtotal_bdt: number;
  total_bdt: number;
  payment_method: string;
  payment_status: string;
  payment_reference: string | null;
  in_stock_eta: string | null;
  pre_order_eta: string | null;
  shipment_id: string | null;
  order_lines: DbLine[];
  tracking_steps: DbStep[];
  users: { name: string; email: string } | null;
};

type DbLine = {
  id: string;
  product_id: string;
  product_name: string;
  variant: string | null;
  quantity: number;
  unit_price_bdt: number;
  total_bdt: number;
  type: string;
  quote_id: string | null;
};

type DbStep = {
  id: string;
  label: string;
  description: string;
  occurred_at: string | null;
  status: string;
  position: number;
};

const ADMIN_ORDER_SELECT = `
  id, customer_id, placed_at, status, type, delivery_method,
  shipping_bdt, duty_bdt, handling_bdt, local_delivery_bdt,
  subtotal_bdt, total_bdt, payment_method, payment_status,
  payment_reference, in_stock_eta, pre_order_eta, shipment_id,
  order_lines ( id, product_id, product_name, variant, quantity, unit_price_bdt, total_bdt, type, quote_id ),
  tracking_steps ( id, label, description, occurred_at, status, position ),
  users ( name, email )
` as const;

function mapAdminOrder(row: DbOrder): AdminOrder {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.users?.name ?? "Unknown",
    customerEmail: row.users?.email ?? "",
    placedAt: row.placed_at,
    status: row.status as OrderStatus,
    type: row.type as Order["type"],
    lines: [...row.order_lines].map(
      (l): OrderLine => ({
        id: l.id,
        productId: l.product_id,
        productName: l.product_name,
        variant: l.variant ?? undefined,
        quantity: l.quantity,
        unitPriceBDT: l.unit_price_bdt,
        totalBDT: l.total_bdt,
        type: l.type as OrderLine["type"],
        quoteId: l.quote_id ?? undefined,
      })
    ),
    deliveryMethod: row.delivery_method as Order["deliveryMethod"],
    shippingBDT: row.shipping_bdt,
    dutyBDT: row.duty_bdt,
    handlingBDT: row.handling_bdt,
    localDeliveryBDT: row.local_delivery_bdt,
    subtotalBDT: row.subtotal_bdt,
    totalBDT: row.total_bdt,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as Order["paymentStatus"],
    paymentReference: row.payment_reference ?? undefined,
    inStockEta: row.in_stock_eta ?? undefined,
    preOrderEta: row.pre_order_eta ?? undefined,
    shipmentId: row.shipment_id ?? undefined,
    trackingSteps: [...row.tracking_steps]
      .sort((a, b) => a.position - b.position)
      .map(
        (s): TrackingStep => ({
          id: s.id,
          label: s.label,
          description: s.description,
          occurredAt: s.occurred_at ?? undefined,
          status: s.status as TrackingStep["status"],
          position: s.position,
        })
      ),
  };
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  await assertAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ADMIN_ORDER_SELECT)
    .order("placed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapAdminOrder(row as unknown as DbOrder));
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: now })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  // Mark the matching tracking step as done
  const stepMap: Partial<Record<OrderStatus, string>> = {
    sourcing: "Sourcing",
    outbound: "Shipped from origin",
    "in-transit": "In transit",
    customs: "Dhaka customs",
    "out-for-delivery": "Out for delivery",
    delivered: "Delivered",
  };

  const stepLabel = stepMap[status];
  if (stepLabel) {
    await supabase
      .from("tracking_steps")
      .update({ status: "done", occurred_at: now })
      .eq("order_id", orderId)
      .eq("label", stepLabel);
  }

  if (status === "delivered") {
    const { data: ord } = await supabase
      .from("orders")
      .select("customer_id")
      .eq("id", orderId)
      .single();
    if (ord) {
      const { data: profile } = await supabase
        .from("users")
        .select("email, name")
        .eq("id", ord.customer_id)
        .single();
      if (profile) {
        await sendDeliveryEmail({ id: orderId, email: profile.email, name: profile.name }).catch(() => {});
      }
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order["paymentStatus"],
  paymentReference?: string
): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      ...(paymentReference !== undefined && { payment_reference: paymentReference }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
}
