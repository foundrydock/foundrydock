import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide06Product() {
  const { t } = useLanguage();

  const columns = [
    { key: 'col1', features: ['f1', 'f2', 'f3', 'f4', 'f5'] },
    { key: 'col2', features: ['f1', 'f2', 'f3', 'f4', 'f5'] },
    { key: 'col3', features: ['f1', 'f2', 'f3', 'f4', 'f5'] },
  ];

  const stats = [
    { value: '19', key: 'stat1' },
    { value: '30+', key: 'stat2' },
    { value: 'Stripe', key: 'stat3' },
    { value: 'Posti', key: 'stat4' },
  ];

  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-10">
          <span className="type-caption text-slide-accent-light tracking-widest uppercase">{t('product.section')}</span>
          <h2 className="type-h1 mt-4 text-white">{t('product.title')}</h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.key} className="flex flex-col">
              <div className="bg-slide-accent/20 rounded-xl p-8 mb-6">
                <h3 className="type-h3 text-slide-accent-light">{t(`product.${col.key}`)}</h3>
              </div>
              <ul className="space-y-5 flex-1">
                {col.features.map((f) => (
                  <li key={f} className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-slide-accent shrink-0" />
                    <span className="type-body text-white/80">{t(`product.${col.key}.${f}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex gap-16 pt-8 border-t border-white/10 mt-8">
          {stats.map((s) => (
            <div key={s.key}>
              <span className="type-h2 text-slide-accent">{s.value}</span>
              <p className="type-caption text-white/70">{t(`product.${s.key}.label`)}</p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
