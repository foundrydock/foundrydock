import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide04Market() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">03 — Markkina</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            Kasvava markkina, vähän kilpailua
          </h2>
        </div>

        <div className="flex-1 flex gap-16">
          {/* TAM SAM SOM */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[500px] h-[500px]">
              {/* TAM */}
              <div className="absolute inset-0 rounded-full border-2 border-slide-gray-200 bg-slide-gray-100/50 flex items-start justify-center pt-12">
                <div className="text-center">
                  <span className="type-metric text-slide-gray-600">$44.5B</span>
                  <p className="type-caption text-slide-gray-600">TAM — Globaali 3D-tulostusmarkkina 2028</p>
                </div>
              </div>
              {/* SAM */}
              <div className="absolute top-[100px] left-[100px] right-[100px] bottom-[100px] rounded-full border-2 border-slide-accent/30 bg-slide-accent/5 flex items-start justify-center pt-10">
                <div className="text-center">
                  <span className="type-metric text-slide-accent">€850M</span>
                  <p className="type-caption text-slide-gray-500">SAM — Pohjoismaat + B2B palvelut</p>
                </div>
              </div>
              {/* SOM */}
              <div className="absolute top-[200px] left-[200px] right-[200px] bottom-[200px] rounded-full border-2 border-slide-accent bg-slide-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <span className="type-h2 text-slide-accent font-bold">€15M</span>
                  <p className="type-caption text-slide-gray-600">SOM — Suomi Y1-3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Market drivers */}
          <div className="w-[500px] flex flex-col justify-center space-y-8">
            <h3 className="type-h3 text-slide-gray-900">Markkinadriverit</h3>
            {[
              { label: 'Globaali CAGR', value: '23.3%', desc: '3D-tulostusmarkkina kasvaa voimakkaasti' },
              { label: 'B2B-osuus', value: '78%', desc: 'Yrityskäyttö dominoi markkinaa' },
              { label: 'Suomi', value: '+35%', desc: 'Kotimainen 3D-tulostuksen YoY kasvu' },
              { label: 'Platformisaatio', value: 'Alku', desc: 'Ei vakiintunutta marketplace-toimijaa Pohjoismaissa' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-6">
                <div className="shrink-0 w-[100px]">
                  <span className="type-h2 text-slide-accent font-bold">{item.value}</span>
                </div>
                <div>
                  <span className="type-body font-semibold text-slide-gray-900">{item.label}</span>
                  <p className="type-caption text-slide-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
