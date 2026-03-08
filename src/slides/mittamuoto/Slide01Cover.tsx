import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide01Cover() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col justify-center h-full px-20 py-16">
        <div className="space-y-12">
          {/* Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-[2px] bg-slide-accent" />
            <span className="type-caption text-slide-accent-light tracking-widest uppercase">
              Seed Rahoituskierros
            </span>
          </div>

          {/* Title */}
          <h1 className="type-display leading-none tracking-tight">
            Mittamuoto
          </h1>

          {/* Subtitle */}
          <p className="type-h2 text-white/80 max-w-[1100px] leading-relaxed font-light">
            3D-tulosteiden ja suunnitelmien kilpailutus- ja tilausalusta
          </p>

          {/* Key value prop */}
          <div className="flex items-center gap-8 pt-8">
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-3 h-3 rounded-full bg-slide-accent" />
              <span className="type-body">B2B Marketplace</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-3 h-3 rounded-full bg-slide-accent" />
              <span className="type-body">3D-tulostus & suunnittelu</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-3 h-3 rounded-full bg-slide-accent" />
              <span className="type-body">Suomi & Pohjoismaat</span>
            </div>
          </div>

          {/* Contact */}
          <div className="pt-4 text-white/60">
            <span className="type-caption">mittamuoto.com · <a href="mailto:jani@measureshape.com" className="underline hover:text-white">jani@measureshape.com</a> · +358 40 322 4419</span>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
