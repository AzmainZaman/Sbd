import { getAddresses } from "@/actions/addresses";
import { AddressesClient } from "./AddressesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Addresses — SBD Global Shopping",
};

export default async function AddressesPage() {
  const addresses = await getAddresses();
  return <AddressesClient initialAddresses={addresses} />;
}
