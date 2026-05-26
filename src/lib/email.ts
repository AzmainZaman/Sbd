import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "orders@sbd.com.bd";

const BKASH_NUMBER = process.env.BKASH_MERCHANT_NUMBER ?? "01700000000";
const NAGAD_NUMBER = process.env.NAGAD_MERCHANT_NUMBER ?? "01700000000";

function formatBDTEmail(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

function paymentInstructionsHtml(method: string, orderId: string, totalBDT: number): string {
  if (method === "cod") {
    return `<p style="color:#6b6a64">Your order is <strong>Cash on Delivery</strong>. Please have the exact amount ready when the courier arrives.</p>`;
  }
  if (method === "bkash") {
    return `
      <div style="background:#fdf2f7;border:1px solid #f9c0d8;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="font-size:13px;font-weight:600;color:#E2006A;margin:0 0 8px">bKash payment required</p>
        <p style="color:#0e0e0c;margin:0 0 4px">Send <strong>${formatBDTEmail(totalBDT)}</strong> to <strong>${BKASH_NUMBER}</strong> (Send Money).</p>
        <p style="color:#6b6a64;font-size:13px;margin:0">Use <strong>${orderId}</strong> as your reference. We'll confirm within 2 hours.</p>
      </div>`;
  }
  if (method === "nagad") {
    return `
      <div style="background:#fff8f0;border:1px solid #fcd9a8;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="font-size:13px;font-weight:600;color:#F7941D;margin:0 0 8px">Nagad payment required</p>
        <p style="color:#0e0e0c;margin:0 0 4px">Send <strong>${formatBDTEmail(totalBDT)}</strong> to <strong>${NAGAD_NUMBER}</strong> (Send Money).</p>
        <p style="color:#6b6a64;font-size:13px;margin:0">Use <strong>${orderId}</strong> as your reference. We'll confirm within 2 hours.</p>
      </div>`;
  }
  return `
    <div style="background:#f0f4ff;border:1px solid #c5d0f0;border-radius:12px;padding:20px;margin-bottom:20px">
      <p style="font-size:13px;font-weight:600;color:#1B4FBB;margin:0 0 8px">Card / bank transfer required</p>
      <p style="color:#0e0e0c;margin:0 0 4px">Please contact us to complete your payment of <strong>${formatBDTEmail(totalBDT)}</strong>.</p>
      <p style="color:#6b6a64;font-size:13px;margin:0">Quote your order ID <strong>${orderId}</strong>. We'll confirm within 2 hours.</p>
    </div>`;
}

export async function sendOrderConfirmationEmail(order: {
  id: string;
  email: string;
  name: string;
  totalBDT: number;
  paymentMethod: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Order confirmed — ${order.id}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0e0e0c">
        <h1 style="font-size:24px;font-weight:600;margin-bottom:8px">Order placed!</h1>
        <p style="color:#6b6a64;margin-bottom:24px">Hi ${order.name}, your order has been confirmed.</p>
        <div style="background:#f5f5f0;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
          <p style="font-size:12px;color:#6b6a64;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">Order reference</p>
          <p style="font-family:monospace;font-size:22px;font-weight:600;margin:0">${order.id}</p>
        </div>
        ${paymentInstructionsHtml(order.paymentMethod, order.id, order.totalBDT)}
        <p style="color:#6b6a64">Track your order progress in your <a href="https://sbd.com.bd/dashboard/orders" style="color:#c8472b">dashboard</a>.</p>
        <hr style="border:none;border-top:1px solid #e8e4dc;margin:24px 0"/>
        <p style="font-size:12px;color:#6b6a64">SBD Global Shopping — sbd.com.bd</p>
      </div>
    `,
  });
}

export async function sendQuoteEmail(quote: {
  id: string;
  email: string;
  name: string;
  productName: string;
  totalBDT: number;
  expiresAt?: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: quote.email,
    subject: `Your quote is ready — ${quote.productName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0e0e0c">
        <h1 style="font-size:24px;font-weight:600;margin-bottom:8px">Your quote is ready</h1>
        <p style="color:#6b6a64;margin-bottom:16px">Hi ${quote.name}, we've priced your request.</p>
        <p style="font-weight:600">${quote.productName}</p>
        <a href="https://sbd.com.bd/dashboard/quotes" style="display:inline-block;margin-top:16px;background:#c8472b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Review quote</a>
        <hr style="border:none;border-top:1px solid #e8e4dc;margin:24px 0"/>
        <p style="font-size:12px;color:#6b6a64">SBD Global Shopping — sbd.com.bd</p>
      </div>
    `,
  });
}

export async function sendDeliveryEmail(order: {
  id: string;
  email: string;
  name: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: order.email,
    subject: `Your order has been delivered — ${order.id}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0e0e0c">
        <h1 style="font-size:24px;font-weight:600;margin-bottom:8px">Your order is delivered!</h1>
        <p style="color:#6b6a64;margin-bottom:16px">Hi ${order.name}, order <strong>${order.id}</strong> has been delivered.</p>
        <p style="color:#6b6a64">We hope you love your purchase. Please let us know if you have any questions.</p>
        <hr style="border:none;border-top:1px solid #e8e4dc;margin:24px 0"/>
        <p style="font-size:12px;color:#6b6a64">SBD Global Shopping — sbd.com.bd</p>
      </div>
    `,
  });
}
