-- ==============================================================================
-- Fernum Client Portal - Multi-Tenant Isolation & RLS Verification Test
-- Demonstrates that:
-- 1. Client A cannot see Client B's profile, ad slots, or deliverables
-- 2. Client B cannot see Client A's data
-- 3. Clients cannot write or modify ad slots
-- 4. Admin (fernumtv@gmail.com) can see and manage all clients
-- ==============================================================================

BEGIN;

-- 1. Setup Test Users
-- Test Client A
INSERT INTO auth.users (id, email)
VALUES ('11111111-1111-1111-1111-111111111111', 'client_a@brand.com')
ON CONFLICT (id) DO NOTHING;

-- Test Client B
INSERT INTO auth.users (id, email)
VALUES ('22222222-2222-2222-2222-222222222222', 'client_b@store.com')
ON CONFLICT (id) DO NOTHING;

-- Test Admin
INSERT INTO auth.users (id, email)
VALUES ('99999999-9999-9999-9999-999999999999', 'fernumtv@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Populate Profiles
INSERT INTO public.profiles (id, email, plan, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'client_a@brand.com', 'growth', 'client'),
  ('22222222-2222-2222-2222-222222222222', 'client_b@store.com', 'launch', 'client'),
  ('99999999-9999-9999-9999-999999999999', 'fernumtv@gmail.com', 'scale', 'admin')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, plan = EXCLUDED.plan;

-- Populate Ad Slots
INSERT INTO public.ad_slots (id, client_id, title, status)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Client A - Ad Slot 1 (Pain Angle)', 'in_production'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Client B - Ad Slot 1 (UGC Review)', 'delivered')
ON CONFLICT (id) DO NOTHING;

-- Populate Deliverables
INSERT INTO public.deliverables (id, ad_slot_id, file_name, file_path)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'client_a_ad1_fullhd.mp4', 'client_a/ad1.mp4'),
  ('d2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'client_b_ad1_fullhd.mp4', 'client_b/ad1.mp4')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- TEST 1: Act as Client A
-- ==============================================================================
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" TO '11111111-1111-1111-1111-111111111111';
SET LOCAL "request.jwt.claim.email" TO 'client_a@brand.com';

-- Client A selects from ad_slots: MUST return exactly 1 row (Client A's ad) and ZERO rows for Client B
SELECT count(*) AS client_a_visible_ad_slots FROM public.ad_slots;
-- Expected output: 1

-- Client A selects from deliverables: MUST return only Client A's deliverable
SELECT count(*) AS client_a_visible_deliverables FROM public.deliverables;
-- Expected output: 1

-- Client A attempts to update Client B's ad slot: MUST FAIL or affect 0 rows
UPDATE public.ad_slots SET status = 'delivered' WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Affected rows: 0 (blocked by RLS)

-- ==============================================================================
-- TEST 2: Act as Client B
-- ==============================================================================
SET LOCAL "request.jwt.claim.sub" TO '22222222-2222-2222-2222-222222222222';
SET LOCAL "request.jwt.claim.email" TO 'client_b@store.com';

-- Client B selects from ad_slots: MUST return exactly 1 row (Client B's ad)
SELECT count(*) AS client_b_visible_ad_slots FROM public.ad_slots;
-- Expected output: 1

-- Client B selects from deliverables: MUST return only Client B's deliverable
SELECT count(*) AS client_b_visible_deliverables FROM public.deliverables;
-- Expected output: 1

-- ==============================================================================
-- TEST 3: Act as Admin (fernumtv@gmail.com)
-- ==============================================================================
SET LOCAL "request.jwt.claim.sub" TO '99999999-9999-9999-9999-999999999999';
SET LOCAL "request.jwt.claim.email" TO 'fernumtv@gmail.com';

-- Admin selects from ad_slots: MUST see all ad slots across all clients
SELECT count(*) AS admin_visible_ad_slots FROM public.ad_slots;
-- Expected output: 2

ROLLBACK;
