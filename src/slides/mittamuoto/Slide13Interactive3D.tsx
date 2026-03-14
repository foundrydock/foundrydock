import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import designImage from '@/assets/3d-design-industrial.jpg';
import { T } from '@/components/slides/EditableText';

export default function Slide13Interactive3D() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex h-full">
        {/* Left content */}
        <div className="w-[45%] flex flex-col justify-center px-20 py-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-white/30" />
              <T k="3d.section" className="type-caption text-white/60 tracking-widest uppercase" />
            </div>

            <T k="3d.title" as="h2" className="type-h1 text-white leading-tight" />

            <T k="3d.desc" as="p" className="type-body-lg text-white/60 leading-relaxed" />

            <div className="space-y-6 pt-4">
              {[
                { value: 'FDM', key: '3d.fdm' },
                { value: 'SLA', key: '3d.sla' },
                { value: 'CNC', key: '3d.cnc' },
                { value: 'SLS', key: '3d.sls' },
              ].map((s) => (
                <div key={s.key} className="flex items-center gap-4">
                  <span className="type-h3 text-white font-semibold w-16">{s.value}</span>
                  <T k={s.key} className="type-body text-white/70" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="w-[55%] relative">
          <img
            src={designImage}
            alt="3D CAD technical design"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slide-primary via-transparent to-transparent" />
        </div>
      </div>
    </MSSlideLayout>
  );
}
