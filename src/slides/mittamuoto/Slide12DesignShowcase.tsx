import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import designImage from '@/assets/3d-design-industrial.jpg';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide12DesignShowcase() {
  const { t } = useLanguage();

  return (
    <MSSlideLayout variant="dark">
      <div className="flex h-full">
        <div className="w-[45%] flex flex-col justify-center px-20 py-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-slide-accent-light" />
              <span className="type-caption text-slide-accent-light tracking-widest uppercase">{t('design.section')}</span>
            </div>

            <h2 className="type-h1 text-white leading-tight">{t('design.title')}</h2>

            <p className="type-body-lg text-white/70 leading-relaxed">{t('design.desc')}</p>

            <div className="space-y-5 pt-4">
              {['design.f1', 'design.f2', 'design.f3', 'design.f4'].map((key) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-white/60 shrink-0" />
                  <span className="type-body text-white/80">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[55%] relative">
          <img src={designImage} alt="3D CAD design - wireframe to solid model" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slide-primary via-transparent to-transparent" />
        </div>
      </div>
    </MSSlideLayout>
  );
}
