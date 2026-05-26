export type Address = {
  id: string;
  userId: string;
  fullName: string;
  label: string | null;
  streetAddress: string;
  apt: string | null;
  area: string;
  city: string;
  postalCode: string;
  landmark: string | null;
  isDefault: boolean;
};

export type AddressInput = {
  fullName: string;
  label?: string;
  streetAddress: string;
  apt?: string;
  area: string;
  city: string;
  postalCode: string;
  landmark?: string;
};
