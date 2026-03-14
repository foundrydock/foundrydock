import React, { useRef, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { ImagePlus } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  imageKey: string; // unique key for persistence
}

export function EditableImage({ src, alt, className, imageKey }: EditableImageProps) {
  const { editMode, overridesKey } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storageKey = `img-override-${overridesKey}-${imageKey}`;
  const overrideSrc = localStorage.getItem(storageKey);
  const displaySrc = overrideSrc || src;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    fileInputRef.current?.click();
  }, [editMode]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      localStorage.setItem(storageKey, dataUrl);
      // Force re-render
      window.dispatchEvent(new Event('storage'));
      // Trigger React update
      e.target.value = '';
      window.location.reload(); // Simple approach for image updates
    };
    reader.readAsDataURL(file);
  }, [storageKey]);

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
              <ImagePlus className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Vaihda kuva</span>
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
