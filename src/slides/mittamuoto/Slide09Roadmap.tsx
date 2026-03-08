import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide09Roadmap() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">08 — Tiekartta</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            Go-to-market & kehitys
          </h2>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative">
            {/* Line */}
            <div className="absolute top-[40px] left-0 right-0 h-1 bg-slide-gray-200" />
            <div className="absolute top-[40px] left-0 w-[25%] h-1 bg-slide-accent" />

            <div className="grid grid-cols-4 gap-6 relative">
              {[
                {
                  phase: 'Q1-Q2 2026',
                  title: 'Lanseeraus',
                  active: true,
                  items: [
                    'Ensimmäiset B2B-asiakkaat',
                    'Palveluntarjoajaverkoston kasvu',
                    'Markkinointi & SEO',
                    'Käyttäjäpalaute-iteraatiot',
                  ],
                },
                {
                  phase: 'Q3-Q4 2026',
                  title: 'Kasvu',
                  active: false,
                  items: [
                    'Automaattinen instant quote',
                    'Materiaalidatabase',
                    'Kumppanuudet (teollisuus)',
                    'NPS > 50',
                  ],
                },
                {
                  phase: 'H1 2027',
                  title: 'Skaalaus',
                  active: false,
                  items: [
                    'Pohjoismaat-laajentuminen',
                    'API avaaminen',
                    'Enterprise-tilit',
                    'Seed-kierros',
                  ],
                },
                {
                  phase: 'H2 2027+',
                  title: 'Laajentuminen',
                  active: false,
                  items: [
                    'CNC & laserleikkaus',
                    'Eurooppa',
                    'AI-hinnoittelu',
                    'Series A -valmius',
                  ],
                },
              ].map((phase) => (
                <div key={phase.phase} className="flex flex-col items-start">
                  {/* Node */}
                  <div className={`w-8 h-8 rounded-full border-4 mb-6 ${
                    phase.active 
                      ? 'bg-slide-accent border-slide-accent' 
                      : 'bg-white border-slide-gray-300'
                  }`} />
                  <span className={`type-label mb-1 ${phase.active ? 'text-slide-accent' : 'text-slide-gray-600'}`}>
                    {phase.phase}
                  </span>
                  <h3 className="type-h3 text-slide-gray-900 mb-4">{phase.title}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slide-gray-400 mt-3 shrink-0" />
                        <span className="type-caption text-slide-gray-600">{item}</span>
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
