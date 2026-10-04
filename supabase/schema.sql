-- ==============================================================================
-- Fernum Client Portal & Video Ad Storage - Supabase Schema
-- Includes:
-- 1. profiles (client profile & plan subscription)
-- 2. ad_slots (production status & delivery dates)
-- 3. deliverables (delivered video files in private storage)
-- 4. Row Level Security (RLS) policies ensuring complete multi-tenant client isolation
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'launch' CHECK (plan IN ('launch', 'growth', 'scale')),
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  brand_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Ad Slots Table
CREATE TABLE IF NOT EXISTS public.ad_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'brief_received' CHECK (status IN ('brief_received', 'script_ready', 'in_production', 'delivered')),
  due_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Deliverables Table (Delivered Video Exports & Hook Cuts)
CREATE TABLE IF NOT EXISTS public.deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_slot_id UUID NOT NULL REFERENCES public.ad_slots(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in the private Supabase Storage bucket 'deliverables'
  aspect_ratio TEXT DEFAULT '9:16', -- '9:16', '1:1', '16:9'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_ad_slots_client_id ON public.ad_slots(client_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_ad_slot_id ON public.deliverables(ad_slot_id);

-- ==============================================================================
-- Helper Functions & Trigger for Automatic Profile Creation on Sign-Up
-- ==============================================================================

-- Helper function: Is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'email' IN ('fernumtv@gmail.com')) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ),
    false
  );
$$;

-- Trigger: Automatically create public.profiles row when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role TEXT := 'client';
BEGIN
  IF NEW.email = 'fernumtv@gmail.com' THEN
    v_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, email, plan, role)
  VALUES (NEW.id, NEW.email, 'launch', v_role)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all portal tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL
  USING (public.is_admin());

-- Ad Slots Policies: Client can only SELECT their own ad slots; Admin has full access
DROP POLICY IF EXISTS "ad_slots_select_own_or_admin" ON public.ad_slots;
CREATE POLICY "ad_slots_select_own_or_admin" ON public.ad_slots
  FOR SELECT
  USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "ad_slots_admin_insert" ON public.ad_slots;
CREATE POLICY "ad_slots_admin_insert" ON public.ad_slots
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "ad_slots_admin_update" ON public.ad_slots;
CREATE POLICY "ad_slots_admin_update" ON public.ad_slots
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "ad_slots_admin_delete" ON public.ad_slots;
CREATE POLICY "ad_slots_admin_delete" ON public.ad_slots
  FOR DELETE
  USING (public.is_admin());

-- Deliverables Policies: Client can only view deliverables of their own ad slots
DROP POLICY IF EXISTS "deliverables_select_own_or_admin" ON public.deliverables;
CREATE POLICY "deliverables_select_own_or_admin" ON public.deliverables
  FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.ad_slots
      WHERE ad_slots.id = deliverables.ad_slot_id
        AND ad_slots.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "deliverables_admin_insert" ON public.deliverables;
CREATE POLICY "deliverables_admin_insert" ON public.deliverables
  FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "deliverables_admin_update" ON public.deliverables;
CREATE POLICY "deliverables_admin_update" ON public.deliverables
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "deliverables_admin_delete" ON public.deliverables;
CREATE POLICY "deliverables_admin_delete" ON public.deliverables
  FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- Private Supabase Storage Bucket Setup
-- ==============================================================================
-- Insert the private 'deliverables' storage bucket (public = false)
INSERT INTO storage.buckets (id, name, public)
VALUES ('deliverables', 'deliverables', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policy: Clients can read only their authorized deliverables
DROP POLICY IF EXISTS "storage_deliverables_client_select" ON storage.objects;
CREATE POLICY "storage_deliverables_client_select" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'deliverables' AND (
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.deliverables d
        JOIN public.ad_slots a ON a.id = d.ad_slot_id
        WHERE d.file_path = storage.objects.name
          AND a.client_id = auth.uid()
      )
    )
  );

-- Storage Policy: Admin can upload and delete deliverables
DROP POLICY IF EXISTS "storage_deliverables_admin_insert" ON storage.objects;
CREATE POLICY "storage_deliverables_admin_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'deliverables' AND public.is_admin());

DROP POLICY IF EXISTS "storage_deliverables_admin_delete" ON storage.objects;
CREATE POLICY "storage_deliverables_admin_delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'deliverables' AND public.is_admin());
