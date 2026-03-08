import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Check } from 'lucide-react';

export default function Slide07Traction() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">08 — Traktio</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            Tilanne nyt
          </h2>
          <p className="type-body-lg text-slide-gray-600 mt-3">
            Päivitä nämä luvut omilla metriikoillasi
          </p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-4 gap-8 mb-12">
          {[
            { value: '—', label: 'Rekisteröityneet käyttäjät', note: 'Lisää luku' },
            { value: '—', label: 'Palveluntarjoajat', note: 'Lisää luku' },
            { value: '—', label: 'Toteutuneet tilaukset', note: 'Lisää luku' },
            { value: '4.9/5', label: 'Asiakasarvosana', note: 'Lähde: mittamuoto.com' },
          ].map((m) => (
            <div key={m.label} className="slide-metric-card p-8 text-center">
              <span className="type-display text-slide-accent">{m.value}</span>
              <p className="type-body font-semibold text-slide-gray-900 mt-2">{m.label}</p>
              <p className="type-caption text-slide-gray-600 mt-1">{m.note}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="flex-1">
          <h3 className="type-h3 text-slide-gray-900 mb-8">Saavutetut virstanpylväät</h3>
          <div className="grid grid-cols-2 gap-x-16 gap-y-6">
            {[
              'Täysin toimiva alusta julkaistu',
              'Stripe-maksuintegraatio tuotannossa',
              'Posti-toimitusintegraatio',
              'Palveluntarjoajien CRM & kampanjatyökalut',
              'Verkkokauppa (Shop) lanseerattu',
              'Admin-hallintapaneeli',
              'Tietoturvaskannaus & hardening tehty',
              'Jira-integraatio tiketöintiin',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check className="w-6 h-6 text-slide-gray-900 shrink-0" strokeWidth={2} />
                <span className="type-body text-slide-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
