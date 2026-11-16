-- Durable contract records for the server-side Next.js contract API.
-- The route uses the server-only InsForge project admin key; browser roles get no access.
CREATE TABLE IF NOT EXISTS public.farmora_contract_records (
  id text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farmora_contract_records ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.farmora_contract_records FROM anon, authenticated;
GRANT ALL ON TABLE public.farmora_contract_records TO project_admin;
