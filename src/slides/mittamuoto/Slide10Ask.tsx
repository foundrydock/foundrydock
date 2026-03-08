import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { T } from '@/components/slides/EditableText';

export default function Slide10Ask() {
  const funds = [
    { pct: '40%', key: 'f1' },
    { pct: '30%', key: 'f2' },
    { pct: '20%', key: 'f3' },
    { pct: '10%', key: 'f4' },
  ];

  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col justify-center h-full px-20 py-16">
        <div className="max-w-[1400px]">
          <T k="ask.section" className="type-caption text-slide-accent-light tracking-widest uppercase" />
          
          <T k="ask.title" as="h2" className="type-display text-white mt-6 mb-8" />

          <T k="ask.subtitle" as="p" className="type-h2 text-white/70 font-light mb-16 max-w-[1000px]" />

          <div className="grid grid-cols-4 gap-8 mb-16">
            {funds.map((item) => (
              <div key={item.key} className="border-t-2 border-slide-accent pt-6">
                <span className="type-metric text-slide-accent">{item.pct}</span>
                <T k={`ask.${item.key}.label`} as="h3" className="type-h3 text-white mt-2" />
                <T k={`ask.${item.key}.desc`} as="p" className="type-body text-white/70 mt-2" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-12 pt-8 border-t border-white/10">
            <div>
              <T k="ask.cta" as="p" className="type-body-lg text-white" />
              <p className="type-body text-white/70 mt-1"><a href="mailto:jani@measureshape.com" className="underline hover:text-white">jani@measureshape.com</a> · +358 40 322 4419</p>
            </div>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
