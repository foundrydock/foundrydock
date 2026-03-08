import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { T } from '@/components/slides/EditableText';

export default function Slide06Product() {
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
          <T k="product.section" className="type-caption text-slide-accent-light tracking-widest uppercase" />
          <T k="product.title" as="h2" className="type-h1 mt-4 text-white" />
        </div>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.key} className="flex flex-col">
              <div className="bg-slide-accent/20 rounded-xl p-8 mb-6">
                <T k={`product.${col.key}`} as="h3" className="type-h3 text-slide-accent-light" />
              </div>
              <ul className="space-y-5 flex-1">
                {col.features.map((f) => (
                  <li key={f} className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-slide-accent shrink-0" />
                    <T k={`product.${col.key}.${f}`} className="type-body text-white/80" />
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
              <T k={`product.${s.key}.label`} as="p" className="type-caption text-white/70" />
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
