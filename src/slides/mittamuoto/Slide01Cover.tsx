import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide01Cover() {
  const { t } = useLanguage();
  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col justify-center h-full px-20 py-16">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-[2px] bg-slide-accent" />
            <span className="type-caption text-slide-accent-light tracking-widest uppercase">
              {t('cover.tagline')}
            </span>
          </div>

          <h1 className="type-display leading-none tracking-tight">
            {t('cover.title')}
          </h1>

          <p className="type-h2 text-white/80 max-w-[1100px] leading-relaxed font-light">
            {t('cover.subtitle')}
          </p>

          <div className="flex items-center gap-8 pt-8">
            {['cover.prop1', 'cover.prop2', 'cover.prop3'].map((key) => (
              <div key={key} className="flex items-center gap-3 text-white/70">
                <div className="w-3 h-3 rounded-full bg-slide-accent" />
                <span className="type-body">{t(key)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 text-white/60">
            <span className="type-caption">mittamuoto.com · <a href="mailto:jani@measureshape.com" className="underline hover:text-white">jani@measureshape.com</a> · +358 40 322 4419</span>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
