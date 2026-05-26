import { CheckoutHeader } from "@/components/layout/CheckoutHeader";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CheckoutHeader />
      <main id="main-content" className="flex-1">{children}</main>
    </>
  );
}
