import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide07Traction() {
  const { t } = useLanguage();

  const metrics = [
    { value: '—', key: 'm1' },
    { value: '—', key: 'm2' },
    { value: '—', key: 'm3' },
    { value: '4.9/5', key: 'm4' },
  ];

  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">{t('traction.section')}</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">{t('traction.title')}</h2>
          <p className="type-body-lg text-slide-gray-600 mt-3">{t('traction.subtitle')}</p>
        </div>

        <div className="grid grid-cols-4 gap-8 mb-12">
          {metrics.map((m) => (
            <div key={m.key} className="slide-metric-card p-8 text-center">
              <span className="type-display text-slide-accent">{m.value}</span>
              <p className="type-body font-semibold text-slide-gray-900 mt-2">{t(`traction.${m.key}`)}</p>
              <p className="type-caption text-slide-gray-600 mt-1">{t(`traction.${m.key}.note`)}</p>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <h3 className="type-h3 text-slide-gray-900 mb-8">{t('traction.milestones')}</h3>
          <div className="grid grid-cols-2 gap-x-16 gap-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <Check className="w-6 h-6 text-slide-gray-900 shrink-0" strokeWidth={2} />
                <span className="type-body text-slide-gray-700">{t(`traction.ms${n}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
