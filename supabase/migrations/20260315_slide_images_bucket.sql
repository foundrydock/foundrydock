-- Luo julkinen slide-images -bucket kuvien latauksia varten
INSERT INTO storage.buckets (id, name, public)
VALUES ('slide-images', 'slide-images', true)
ON CONFLICT (id) DO NOTHING;

-- Kaikki voivat lukea (julkiset URL:t)
DROP POLICY IF EXISTS "slide-images public read" ON storage.objects;
CREATE POLICY "slide-images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'slide-images');

-- Kirjautuneet käyttäjät voivat ladata (upsert)
DROP POLICY IF EXISTS "slide-images auth upload" ON storage.objects;
CREATE POLICY "slide-images auth upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'slide-images');

DROP POLICY IF EXISTS "slide-images auth update" ON storage.objects;
CREATE POLICY "slide-images auth update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'slide-images');

-- image_overrides taulun RLS-politiikat
ALTER TABLE image_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "image_overrides select" ON image_overrides;
CREATE POLICY "image_overrides select"
  ON image_overrides FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "image_overrides upsert" ON image_overrides;
CREATE POLICY "image_overrides upsert"
  ON image_overrides FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "image_overrides update" ON image_overrides;
CREATE POLICY "image_overrides update"
  ON image_overrides FOR UPDATE
  TO authenticated
  USING (true);
