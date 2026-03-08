import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide02Problem() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">01 — Ongelma</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            3D-tulostuspalveluiden hankinta on rikki
          </h2>
        </div>

        {/* Pain points */}
        <div className="flex-1 grid grid-cols-3 gap-10">
          {[
            {
              number: '01',
              title: 'Hajanainen markkina',
              desc: 'Yritykset joutuvat etsimään toimittajia manuaalisesti. Ei keskitettyä paikkaa vertailla hintoja, materiaaleja ja toimitusaikoja.',
              stat: '70%',
              statLabel: 'yrityksistä käyttää vain 1 toimittajaa',
            },
            {
              number: '02',
              title: 'Läpinäkymätön hinnoittelu',
              desc: 'Hintatarjouksia pyydetään sähköpostilla. Prosessi kestää päiviä eikä vertailtavuutta ole. Pienet erät jäävät usein liian kalliiksi.',
              stat: '3-5 pv',
              statLabel: 'keskimääräinen tarjousaika',
            },
            {
              number: '03',
              title: 'Luottamuspula',
              desc: 'Uuden toimittajan laatu ja luotettavuus ovat arvoituksia. Ei arvosteluja, referenssejä tai standardoitua laatuvarmistusta.',
              stat: '0',
              statLabel: 'avoimia arvosteluportaaleja',
            },
          ].map((item) => (
            <div key={item.number} className="flex flex-col">
              <span className="type-metric text-slide-accent">{item.stat}</span>
              <span className="type-caption text-slide-gray-600 mb-6">{item.statLabel}</span>
              <div className="slide-divider mb-6" />
              <span className="type-label text-slide-accent mb-2">{item.number}</span>
              <h3 className="type-h3 text-slide-gray-900 mb-3">{item.title}</h3>
              <p className="type-body text-slide-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
