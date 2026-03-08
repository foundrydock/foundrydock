import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { T } from '@/components/slides/EditableText';

export default function Slide02Problem() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-12">
          <T k="problem.section" className="type-caption text-slide-accent tracking-widest uppercase" />
          <T k="problem.title" as="h2" className="type-h1 mt-4 text-slide-gray-900" />
        </div>

        <div className="flex-1 grid grid-cols-3 gap-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col">
              <T k={`problem.${n}.stat`} className="type-metric text-slide-accent" />
              <T k={`problem.${n}.statLabel`} className="type-caption text-slide-gray-600 mb-6" />
              <div className="slide-divider mb-6" />
              <span className="type-label text-slide-accent mb-2">{`0${n}`}</span>
              <T k={`problem.${n}.title`} as="h3" className="type-h3 text-slide-gray-900 mb-3" />
              <T k={`problem.${n}.desc`} as="p" className="type-body text-slide-gray-600 leading-relaxed" />
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
