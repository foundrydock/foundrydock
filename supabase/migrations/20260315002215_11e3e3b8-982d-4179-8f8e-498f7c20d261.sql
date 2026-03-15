
-- Fix recursive RLS policies that query profiles table directly

-- 1. PROFILES: "Admins see all profiles" is recursive
DROP POLICY IF EXISTS "Admins see all profiles" ON public.profiles;
CREATE POLICY "Admins see all profiles" ON public.profiles
FOR ALL USING (public.is_global_admin());

-- 2. ASSET_FOLDERS: "Admins manage folders" queries profiles directly
DROP POLICY IF EXISTS "Admins manage folders" ON public.asset_folders;
CREATE POLICY "Admins manage folders" ON public.asset_folders
FOR ALL USING (public.is_global_admin());

-- 3. ASSETS: "Admins manage assets" queries profiles directly
DROP POLICY IF EXISTS "Admins manage assets" ON public.assets;
CREATE POLICY "Admins manage assets" ON public.assets
FOR ALL USING (public.is_global_admin());

-- 4. SHARE_LINKS: "Admins manage share links" queries profiles directly
DROP POLICY IF EXISTS "Admins manage share links" ON public.share_links;
CREATE POLICY "Admins manage share links" ON public.share_links
FOR ALL USING (public.is_global_admin());
