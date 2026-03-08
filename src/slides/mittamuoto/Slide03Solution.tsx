import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Target, ShieldCheck, Package, Star } from 'lucide-react';
import { T } from '@/components/slides/EditableText';

export default function Slide03Solution() {
  const pillars = [
    { icon: Target, key: 'pillar1' },
    { icon: ShieldCheck, key: 'pillar2' },
    { icon: Package, key: 'pillar3' },
    { icon: Star, key: 'pillar4' },
  ];

  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <T k="solution.section" className="type-caption text-slide-accent tracking-widest uppercase" />
          <T k="solution.title" as="h2" className="type-h1 mt-4 text-slide-gray-900" />
          <T k="solution.subtitle" as="p" className="type-body-lg text-slide-gray-600 mt-4 max-w-[1000px]" />
        </div>

        <div className="flex-1 grid grid-cols-4 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.key} className="slide-card p-8 flex flex-col">
              <pillar.icon className="w-12 h-12 text-slide-gray-900 mb-4" strokeWidth={1.5} />
              <T k={`solution.${pillar.key}.title`} as="h3" className="type-h3 text-slide-gray-900 mb-6" />
              <ul className="space-y-3 flex-1">
                {['p1', 'p2', 'p3'].map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slide-accent mt-3 shrink-0" />
                    <T k={`solution.${pillar.key}.${p}`} className="type-body text-slide-gray-600" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
