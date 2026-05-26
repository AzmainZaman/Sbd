-- Add full_name to addresses so delivery can be addressed to a specific person.
-- Nullable: existing rows are unaffected.
alter table public.addresses
  add column if not exists full_name text;
