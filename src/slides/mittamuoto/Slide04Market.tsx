import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide04Market() {
  const { t } = useLanguage();
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">{t('market.section')}</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">{t('market.title')}</h2>
        </div>

        <div className="flex-1 flex gap-16">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[500px] h-[500px]">
              <div className="absolute inset-0 rounded-full border-2 border-slide-gray-200 bg-slide-gray-100/50 flex items-start justify-center pt-12">
                <div className="text-center">
                  <span className="type-metric text-slide-gray-600">$44.5B</span>
                  <p className="type-caption text-slide-gray-600">{t('market.tam.label')}</p>
                </div>
              </div>
              <div className="absolute top-[100px] left-[100px] right-[100px] bottom-[100px] rounded-full border-2 border-slide-accent/30 bg-slide-accent/5 flex items-start justify-center pt-10">
                <div className="text-center">
                  <span className="type-metric text-slide-accent">€850M</span>
                  <p className="type-caption text-slide-gray-600">{t('market.sam.label')}</p>
                </div>
              </div>
              <div className="absolute top-[200px] left-[200px] right-[200px] bottom-[200px] rounded-full border-2 border-slide-accent bg-slide-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <span className="type-h2 text-slide-accent font-bold">€15M</span>
                  <p className="type-caption text-slide-gray-600">{t('market.som.label')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[500px] flex flex-col justify-center space-y-8">
            <h3 className="type-h3 text-slide-gray-900">{t('market.drivers')}</h3>
            {[
              { key: 'd1', value: '23.3%' },
              { key: 'd2', value: '78%' },
              { key: 'd3', value: '+35%' },
              { key: 'd4', value: undefined },
            ].map((item) => (
              <div key={item.key} className="flex items-start gap-6">
                <div className="shrink-0 w-[100px]">
                  <span className="type-h2 text-slide-accent font-bold">{item.value || t(`market.${item.key}.value`)}</span>
                </div>
                <div>
                  <span className="type-body font-semibold text-slide-gray-900">{t(`market.${item.key}.label`)}</span>
                  <p className="type-caption text-slide-gray-600">{t(`market.${item.key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
