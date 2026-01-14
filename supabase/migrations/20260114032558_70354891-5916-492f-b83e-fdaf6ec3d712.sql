-- Make state column optional (nullable) in addresses table
ALTER TABLE public.addresses ALTER COLUMN state DROP NOT NULL;

-- Set default value for state (empty string) for new records
ALTER TABLE public.addresses ALTER COLUMN state SET DEFAULT '';