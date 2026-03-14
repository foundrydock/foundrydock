
-- Content overrides (text translations)
CREATE TABLE public.content_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'fi',
  translation_key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(deck_key, language, translation_key)
);

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read content_overrides"
  ON public.content_overrides FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert content_overrides"
  ON public.content_overrides FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update content_overrides"
  ON public.content_overrides FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Image overrides
CREATE TABLE public.image_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_key TEXT NOT NULL,
  image_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(deck_key, image_key)
);

ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read image_overrides"
  ON public.image_overrides FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert image_overrides"
  ON public.image_overrides FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update image_overrides"
  ON public.image_overrides FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Presenter notes
CREATE TABLE public.presenter_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_id TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.presenter_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read presenter_notes"
  ON public.presenter_notes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert presenter_notes"
  ON public.presenter_notes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update presenter_notes"
  ON public.presenter_notes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete presenter_notes"
  ON public.presenter_notes FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('slide-images', 'slide-images', true);

CREATE POLICY "Allow public read slide-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'slide-images');

CREATE POLICY "Allow public upload slide-images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'slide-images');

CREATE POLICY "Allow public update slide-images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'slide-images')
  WITH CHECK (bucket_id = 'slide-images');
