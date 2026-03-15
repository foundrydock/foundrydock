
-- Drop the recursive policies
DROP POLICY IF EXISTS "Admins can manage files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload" ON storage.objects;

-- Recreate using is_global_admin() which is SECURITY DEFINER and bypasses RLS
CREATE POLICY "Admins can manage files" ON storage.objects
FOR ALL USING (
  bucket_id = 'assets' AND public.is_global_admin()
);

CREATE POLICY "Admins can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'assets' AND public.is_global_admin()
);
