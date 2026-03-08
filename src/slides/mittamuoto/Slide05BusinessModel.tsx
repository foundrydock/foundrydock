import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide05BusinessModel() {
  const { t } = useLanguage();

  const streams = [
    { key: 'r1', value: '15-20%', accent: true },
    { key: 'r2', value: '€49-199' },
    { key: 'r3', value: 'Shop' },
    { key: 'r4', value: 'B2B' },
  ];

  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">{t('biz.section')}</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">{t('biz.title')}</h2>
        </div>

        <div className="flex-1 flex gap-12">
          <div className="flex-1 grid grid-cols-2 gap-8">
            {streams.map((s) => (
              <div key={s.key} className={`${s.accent ? 'slide-card-accent' : 'slide-card'} p-10 flex flex-col`}>
                <span className={`type-label ${s.accent ? 'text-slide-accent' : 'text-slide-gray-600'} mb-2`}>{t(`biz.${s.key}.label`)}</span>
                <span className="type-metric text-slide-gray-900">{s.value}</span>
                <h3 className="type-h3 text-slide-gray-900 mt-2 mb-4">{t(`biz.${s.key}.title`)}</h3>
                <p className="type-body text-slide-gray-600 leading-relaxed">{t(`biz.${s.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
