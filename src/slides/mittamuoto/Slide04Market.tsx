import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { T } from '@/components/slides/EditableText';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Slide04Market() {
  const { t } = useLanguage();
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <T k="market.section" className="type-caption text-slide-accent tracking-widest uppercase" />
          <T k="market.title" as="h2" className="type-h1 mt-4 text-slide-gray-900" />
        </div>

        <div className="flex-1 flex gap-16">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[600px] h-[500px]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 500">
                <circle cx="300" cy="270" r="220" fill="hsl(var(--slide-gray-100) / 0.5)" stroke="hsl(var(--slide-gray-200))" strokeWidth="2" />
                <circle cx="300" cy="270" r="140" fill="hsl(var(--slide-accent) / 0.05)" stroke="hsl(var(--slide-accent) / 0.3)" strokeWidth="2" />
                <circle cx="300" cy="270" r="60" fill="hsl(var(--slide-accent) / 0.1)" stroke="hsl(var(--slide-accent))" strokeWidth="2" />
                <line x1="160" y1="100" x2="100" y2="50" stroke="hsl(var(--slide-gray-400))" strokeWidth="1.5" />
                <circle cx="160" cy="100" r="3" fill="hsl(var(--slide-gray-400))" />
                <line x1="400" y1="170" x2="510" y2="100" stroke="hsl(var(--slide-accent) / 0.5)" strokeWidth="1.5" />
                <circle cx="400" cy="170" r="3" fill="hsl(var(--slide-accent) / 0.5)" />
                <line x1="340" y1="300" x2="510" y2="380" stroke="hsl(var(--slide-accent))" strokeWidth="1.5" />
                <circle cx="340" cy="300" r="3" fill="hsl(var(--slide-accent))" />
              </svg>

              <div className="absolute" style={{ top: '0px', left: '0px' }}>
                <span className="type-metric text-slide-gray-600">$44.5B</span>
                <T k="market.tam.label" as="p" className="type-caption text-slide-gray-600" />
              </div>

              <div className="absolute" style={{ top: '60px', right: '0px' }}>
                <span className="type-metric text-slide-accent">€850M</span>
                <T k="market.sam.label" as="p" className="type-caption text-slide-gray-600" />
              </div>

              <div className="absolute" style={{ bottom: '60px', right: '0px' }}>
                <span className="type-h2 text-slide-accent font-bold">€15M</span>
                <T k="market.som.label" as="p" className="type-caption text-slide-gray-600" />
              </div>
            </div>
          </div>

          <div className="w-[500px] flex flex-col justify-center space-y-8">
            <T k="market.drivers" as="h3" className="type-h3 text-slide-gray-900" />
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
                  <T k={`market.${item.key}.label`} className="type-body font-semibold text-slide-gray-900" />
                  <T k={`market.${item.key}.desc`} as="p" className="type-caption text-slide-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
