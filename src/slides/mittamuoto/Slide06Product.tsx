import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide06Product() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-10">
          <span className="type-caption text-slide-accent-light tracking-widest uppercase">05 — Tuote</span>
          <h2 className="type-h1 mt-4 text-white">
            Valmis tuote, oikeat käyttäjät
          </h2>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {/* Feature list */}
          {[
            {
              category: 'Tilaaja',
              features: [
                'Tilauslomake + tiedostolatauset',
                'Tarjousten vertailu',
                'Turvallinen Stripe-maksu',
                'Tilauksen seuranta',
                'Arvostelut',
              ],
            },
            {
              category: 'Palveluntarjoaja',
              features: [
                'Tarjousten hallintapaneeli',
                'Tilausten käsittely',
                'Posti-lähetysintegraatio',
                'Sähköpostikampanjat & CRM',
                'Suorat toimeksiannot',
              ],
            },
            {
              category: 'Alusta',
              features: [
                'Admin-hallintapaneeli',
                'Automaattinen escrow-maksu',
                'Jira-integraatio',
                'Posti-toimitusseuranta',
                'Verkkokauppa (Shop)',
              ],
            },
          ].map((col) => (
            <div key={col.category} className="flex flex-col">
              <div className="bg-slide-accent/20 rounded-xl p-8 mb-6">
                <h3 className="type-h3 text-slide-accent-light">{col.category}</h3>
              </div>
              <ul className="space-y-5 flex-1">
                {col.features.map((f) => (
                  <li key={f} className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-slide-accent shrink-0" />
                    <span className="type-body text-white/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom stat bar */}
        <div className="flex gap-16 pt-8 border-t border-white/10 mt-8">
          {[
            { value: '19', label: 'Edge Functions' },
            { value: '30+', label: 'Tietokantataulua' },
            { value: 'Stripe', label: 'Maksuintegraatio' },
            { value: 'Posti', label: 'Toimitusintegraatio' },
          ].map((s) => (
            <div key={s.label}>
              <span className="type-h2 text-slide-accent">{s.value}</span>
              <p className="type-caption text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
