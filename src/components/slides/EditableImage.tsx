import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ImagePlus, Loader2 } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  imageKey: string;
}

export function EditableImage({ src, alt, className, imageKey }: EditableImageProps) {
  const { editMode, overridesKey } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [overrideSrc, setOverrideSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Load override from Supabase
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('image_overrides')
        .select('image_url')
        .eq('deck_key', overridesKey)
        .eq('image_key', imageKey)
        .maybeSingle();

      if (data) setOverrideSrc((data as any).image_url);
    }
    load();
  }, [overridesKey, imageKey]);

  const displaySrc = overrideSrc || src;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode || uploading) return;
    e.stopPropagation();
    fileInputRef.current?.click();
  }, [editMode, uploading]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${overridesKey}/${imageKey}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('slide-images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('slide-images')
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl + '?t=' + Date.now();

      // Save reference to DB
      await supabase
        .from('image_overrides')
        .upsert({
          deck_key: overridesKey,
          image_key: imageKey,
          image_url: publicUrl,
        }, { onConflict: 'deck_key,image_key' });

      setOverrideSrc(publicUrl);
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [overridesKey, imageKey]);

  return (
    <div className="relative group">
      <img src={displaySrc} alt={alt} className={className} />
      {editMode && (
        <>
          <div
            onClick={handleClick}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <ImagePlus className="w-5 h-5 text-white" />
              )}
              <span className="text-white text-sm font-medium">
                {uploading ? 'Ladataan...' : 'Vaihda kuva'}
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
