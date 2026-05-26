"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { assertAuth } from "@/lib/auth-guard";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { CartItem } from "@/context/CartContext";
import type { Order, OrderLine, TrackingStep, PaymentMethod } from "@/types/order";

const INBOUND_SHIPPING_BDT = 1200;
const HANDLING_BDT = 500;
const LOCAL_DELIVERY_BDT = 60;
const DUTY_RATE = 0.08;

function computeFees(subtotalBDT: number) {
  const dutyBDT = Math.round(subtotalBDT * DUTY_RATE);
  const localDeliveryBDT = subtotalBDT >= 5000 ? 0 : LOCAL_DELIVERY_BDT;
  const totalBDT =
    subtotalBDT + INBOUND_SHIPPING_BDT + dutyBDT + HANDLING_BDT + localDeliveryBDT;
  return { dutyBDT, localDeliveryBDT, totalBDT };
}

function generateOrderId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `SBD-${year}-${num}`;
}

const TRACKING_STEPS = [
  { label: "Order placed", description: "Your order has been received and confirmed.", position: 0 },
  { label: "Sourcing", description: "We are purchasing your items from verified retailers.", position: 1 },
  { label: "Shipped from origin", description: "Items have left the source country.", position: 2 },
  { label: "In transit", description: "Package is on its way to Bangladesh.", position: 3 },
  { label: "Dhaka customs", description: "Package is clearing customs. Duties settled on your behalf.", position: 4 },
  { label: "Out for delivery", description: "Your courier is on the way.", position: 5 },
  { label: "Delivered", description: "Package delivered to your address.", position: 6 },
];

export type CreateOrderInput = {
  items: CartItem[];
  deliveryMethod: "split" | "together";
  paymentMethod: PaymentMethod;
  deliveryAddressId: string | null;
};

export async function createOrder(input: CreateOrderInput): Promise<{ orderId: string }> {
  const user = await assertAuth();
  const supabase = await createClient();

  const subtotalBDT = input.items.reduce((sum, i) => sum + i.priceBDT * i.quantity, 0);
  const { dutyBDT, localDeliveryBDT, totalBDT } = computeFees(subtotalBDT);

  const hasPreOrder = input.items.some((i) => i.type === "pre-order");
  const hasInStock = input.items.some((i) => i.type === "in-stock");
  const orderType = hasPreOrder && hasInStock ? "mixed" : hasPreOrder ? "pre-order" : "in-stock";

  const preOrderItem = input.items.find((i) => i.type === "pre-order");
  const inStockEta = hasInStock
    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : null;

  const orderId = generateOrderId();
  const now = new Date().toISOString();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_id: user.id,
    placed_at: now,
    status: "placed",
    type: orderType,
    delivery_method: input.deliveryMethod,
    payment_method: input.paymentMethod,
    payment_status: "pending",
    delivery_address_id: input.deliveryAddressId ?? null,
    subtotal_bdt: subtotalBDT,
    shipping_bdt: INBOUND_SHIPPING_BDT,
    duty_bdt: dutyBDT,
    handling_bdt: HANDLING_BDT,
    local_delivery_bdt: localDeliveryBDT,
    total_bdt: totalBDT,
    in_stock_eta: inStockEta,
    pre_order_eta: preOrderItem?.eta ?? null,
    shipment_id: preOrderItem?.shipmentId ?? null,
  });

  if (orderError) throw new Error(orderError.message);

  const linesInsert = input.items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    product_name: item.productName,
    variant: item.variant ?? null,
    quantity: item.quantity,
    unit_price_bdt: item.priceBDT,
    total_bdt: item.priceBDT * item.quantity,
    type: item.type,
  }));

  const { error: linesError } = await supabase.from("order_lines").insert(linesInsert);
  if (linesError) throw new Error(linesError.message);

  const stepsInsert = TRACKING_STEPS.map((step) => ({
    order_id: orderId,
    label: step.label,
    description: step.description,
    position: step.position,
    status: step.position === 0 ? "done" : "pending",
    occurred_at: step.position === 0 ? now : null,
  }));

  const { error: stepsError } = await supabase.from("tracking_steps").insert(stepsInsert);
  if (stepsError) throw new Error(stepsError.message);

  const { data: profile } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", user.id)
    .single();

  if (profile) {
    await sendOrderConfirmationEmail({
      id: orderId,
      email: profile.email,
      name: profile.name,
      totalBDT,
      paymentMethod: input.paymentMethod,
    }).catch(() => {});
  }

  return { orderId };
}

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

function mapDbOrder(row: DbOrder): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    placedAt: row.placed_at,
    status: row.status as Order["status"],
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

const ORDER_SELECT = `
  id, customer_id, placed_at, status, type, delivery_method,
  shipping_bdt, duty_bdt, handling_bdt, local_delivery_bdt,
  subtotal_bdt, total_bdt, payment_method, payment_status,
  payment_reference, in_stock_eta, pre_order_eta, shipment_id,
  order_lines ( id, product_id, product_name, variant, quantity, unit_price_bdt, total_bdt, type, quote_id ),
  tracking_steps ( id, label, description, occurred_at, status, position )
` as const;

export async function getOrdersByCustomer(): Promise<Order[]> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("customer_id", user.id)
    .order("placed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapDbOrder(row as unknown as DbOrder));
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const user = await assertAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId)
    .eq("customer_id", user.id)
    .single();

  if (error || !data) return null;
  return mapDbOrder(data as unknown as DbOrder);
}

// Public tracking — no auth required; email used as ownership proof.
// Uses service role to bypass RLS, but verifies email in application code.
export async function lookupOrder(
  orderId: string,
  email: string
): Promise<Order | null> {
  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", orderId.trim().toUpperCase())
    .single();

  if (!order) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("email")
    .eq("id", (order as unknown as DbOrder).customer_id)
    .single();

  if (!profile || profile.email.toLowerCase() !== email.trim().toLowerCase()) {
    return null;
  }

  return mapDbOrder(order as unknown as DbOrder);
}
