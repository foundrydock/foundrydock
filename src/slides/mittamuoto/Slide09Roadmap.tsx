import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { T } from '@/components/slides/EditableText';

export default function Slide09Roadmap() {
  const phases = [
    { phase: 'Q1-Q2 2026', key: 'p1', active: true },
    { phase: 'Q3-Q4 2026', key: 'p2', active: false },
    { phase: 'H1 2027', key: 'p3', active: false },
    { phase: 'H2 2027+', key: 'p4', active: false },
  ];

  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <T k="roadmap.section" className="type-caption text-slide-accent tracking-widest uppercase" />
          <T k="roadmap.title" as="h2" className="type-h1 mt-4 text-slide-gray-900" />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="relative">
            <div className="absolute top-[40px] left-0 right-0 h-1 bg-slide-gray-200" />
            <div className="absolute top-[40px] left-0 w-[25%] h-1 bg-slide-accent" />

            <div className="grid grid-cols-4 gap-6 relative">
              {phases.map((p) => (
                <div key={p.key} className="flex flex-col items-start">
                  <div className={`w-8 h-8 rounded-full border-4 mb-6 ${
                    p.active ? 'bg-slide-accent border-slide-accent' : 'bg-white border-slide-gray-300'
                  }`} />
                  <span className={`type-label mb-1 ${p.active ? 'text-slide-accent' : 'text-slide-gray-600'}`}>
                    {p.phase}
                  </span>
                  <T k={`roadmap.${p.key}.title`} as="h3" className="type-h3 text-slide-gray-900 mb-4" />
                  <ul className="space-y-2">
                    {['i1', 'i2', 'i3', 'i4'].map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slide-gray-400 mt-3 shrink-0" />
                        <T k={`roadmap.${p.key}.${i}`} className="type-caption text-slide-gray-600" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
