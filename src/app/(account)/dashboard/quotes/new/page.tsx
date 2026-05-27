import type { Metadata } from "next";
import { QuoteRequestClient } from "./QuoteRequestClient";

export const metadata: Metadata = {
  title: "Request a quote — SBD Global Shopping",
};

export default function NewQuotePage() {
  return <QuoteRequestClient />;
}
