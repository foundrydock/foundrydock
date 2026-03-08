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
            <div className="relative w-[600px] h-[500px]">
              {/* Circles only - no text inside */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 500">
                {/* TAM circle */}
                <circle cx="300" cy="270" r="220" fill="hsl(var(--slide-gray-100) / 0.5)" stroke="hsl(var(--slide-gray-200))" strokeWidth="2" />
                {/* SAM circle */}
                <circle cx="300" cy="270" r="140" fill="hsl(var(--slide-accent) / 0.05)" stroke="hsl(var(--slide-accent) / 0.3)" strokeWidth="2" />
                {/* SOM circle */}
                <circle cx="300" cy="270" r="60" fill="hsl(var(--slide-accent) / 0.1)" stroke="hsl(var(--slide-accent))" strokeWidth="2" />

                {/* Leader line: TAM - top left */}
                <line x1="160" y1="100" x2="100" y2="50" stroke="hsl(var(--slide-gray-400))" strokeWidth="1.5" />
                <circle cx="160" cy="100" r="3" fill="hsl(var(--slide-gray-400))" />

                {/* Leader line: SAM - top right */}
                <line x1="400" y1="170" x2="510" y2="100" stroke="hsl(var(--slide-accent) / 0.5)" strokeWidth="1.5" />
                <circle cx="400" cy="170" r="3" fill="hsl(var(--slide-accent) / 0.5)" />

                {/* Leader line: SOM - bottom right */}
                <line x1="340" y1="300" x2="510" y2="380" stroke="hsl(var(--slide-accent))" strokeWidth="1.5" />
                <circle cx="340" cy="300" r="3" fill="hsl(var(--slide-accent))" />
              </svg>

              {/* TAM label - top left outside */}
              <div className="absolute" style={{ top: '0px', left: '0px' }}>
                <span className="type-metric text-slide-gray-600">$44.5B</span>
                <p className="type-caption text-slide-gray-600">{t('market.tam.label')}</p>
              </div>

              {/* SAM label - top right outside */}
              <div className="absolute" style={{ top: '60px', right: '0px' }}>
                <span className="type-metric text-slide-accent">€850M</span>
                <p className="type-caption text-slide-gray-600">{t('market.sam.label')}</p>
              </div>

              {/* SOM label - bottom right outside */}
              <div className="absolute" style={{ bottom: '60px', right: '0px' }}>
                <span className="type-h2 text-slide-accent font-bold">€15M</span>
                <p className="type-caption text-slide-gray-600">{t('market.som.label')}</p>
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
