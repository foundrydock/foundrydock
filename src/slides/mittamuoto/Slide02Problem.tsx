import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide02Problem() {
  const { t } = useLanguage();
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">{t('problem.section')}</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">{t('problem.title')}</h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col">
              <span className="type-metric text-slide-accent">{t(`problem.${n}.stat`)}</span>
              <span className="type-caption text-slide-gray-600 mb-6">{t(`problem.${n}.statLabel`)}</span>
              <div className="slide-divider mb-6" />
              <span className="type-label text-slide-accent mb-2">{`0${n}`}</span>
              <h3 className="type-h3 text-slide-gray-900 mb-3">{t(`problem.${n}.title`)}</h3>
              <p className="type-body text-slide-gray-600 leading-relaxed">{t(`problem.${n}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
