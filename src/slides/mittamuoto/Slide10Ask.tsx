import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide10Ask() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col justify-center h-full px-20 py-16">
        <div className="max-w-[1400px]">
          {/* Header */}
          <span className="type-caption text-slide-accent-light tracking-widest uppercase">09 — Rahoituskierros</span>
          
          <h2 className="type-display text-white mt-6 mb-8">
            Pre-Seed: €___k
          </h2>

          <p className="type-h2 text-white/70 font-light mb-16 max-w-[1000px]">
            Täydennä summa ja ehdot oman suunnitelmasi mukaan
          </p>

          {/* Use of funds */}
          <div className="grid grid-cols-4 gap-8 mb-16">
            {[
              { pct: '40%', label: 'Tuotekehitys', desc: 'AI-ominaisuudet, instant quote, API' },
              { pct: '30%', label: 'Kasvu & myynti', desc: 'B2B-myynti, markkinointi, SEO' },
              { pct: '20%', label: 'Tiimi', desc: 'Ensimmäiset avainrekrytoinnit' },
              { pct: '10%', label: 'Operaatiot', desc: 'Infra, juridiikka, vakuutukset' },
            ].map((item) => (
              <div key={item.label} className="border-t-2 border-slide-accent pt-6">
                <span className="type-metric text-slide-accent">{item.pct}</span>
                <h3 className="type-h3 text-white mt-2">{item.label}</h3>
                <p className="type-body text-white/70 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="flex items-center gap-12 pt-8 border-t border-white/10">
            <div>
              <p className="type-body-lg text-white">Keskustellaan</p>
              <p className="type-body text-white/50 mt-1">info@mittamuoto.com · +358 40 322 4419</p>
            </div>
            <div>
              <p className="type-body text-white/50">mittamuoto.com</p>
            </div>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
