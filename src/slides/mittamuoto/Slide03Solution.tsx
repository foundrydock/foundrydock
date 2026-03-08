import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Target, ShieldCheck, Package, Star } from 'lucide-react';

export default function Slide03Solution() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">02 — Ratkaisu</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            Yksi alusta, koko arvoketju
          </h2>
          <p className="type-body-lg text-slide-gray-600 mt-4 max-w-[1000px]">
            Mittamuoto yhdistää tilaajat ja valmistajat yhdelle alustalle — kilpailutus, tilaus, maksu ja toimitus samasta paikasta.
          </p>
        </div>

        {/* Solution pillars */}
        <div className="flex-1 grid grid-cols-4 gap-8">
          {[
            {
              icon: Target,
              title: 'Kilpailutus',
              points: ['Tilaus julkaistaan verkostolle', 'Useita tarjouksia nopeasti', 'Vertaile hintaa, aikaa, materiaaleja'],
            },
            {
              icon: ShieldCheck,
              title: 'Turvallinen maksu',
              points: ['Stripe-escrow -malli', 'Raha vapautuu hyväksynnän jälkeen', 'Luottokortit ja laskutus'],
            },
            {
              icon: Package,
              title: 'Logistiikka',
              points: ['Posti-integraatio', 'Automaattinen lähetyksen luonti', 'Seurantakoodit asiakkaalle'],
            },
            {
              icon: Star,
              title: 'Laatu & luottamus',
              points: ['Kaksisuuntaiset arvostelut', 'Palveluntarjoajaprofiilit', 'Tilaushistoria ja portfolio'],
            },
          ].map((pillar) => (
            <div key={pillar.title} className="slide-card p-8 flex flex-col">
              <pillar.icon className="w-12 h-12 text-slide-gray-900 mb-4" strokeWidth={1.5} />
              <h3 className="type-h3 text-slide-gray-900 mb-6">{pillar.title}</h3>
              <ul className="space-y-3 flex-1">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slide-accent mt-3 shrink-0" />
                    <span className="type-body text-slide-gray-600">{point}</span>
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
