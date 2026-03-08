import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide05BusinessModel() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="type-caption text-slide-accent tracking-widest uppercase">04 — Liiketoimintamalli</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            Komissio + SaaS -hybridimalli
          </h2>
        </div>

        <div className="flex-1 flex gap-12">
          {/* Revenue streams */}
          <div className="flex-1 grid grid-cols-2 gap-8">
            <div className="slide-card-accent p-10 flex flex-col">
              <span className="type-label text-slide-accent mb-2">Päätulovirta</span>
              <span className="type-metric text-slide-gray-900">10-15%</span>
              <h3 className="type-h3 text-slide-gray-900 mt-2 mb-4">Transaktiokomissio</h3>
              <p className="type-body text-slide-gray-600 leading-relaxed">
                Jokaisesta toteutuneesta tilauksesta. Asiakas maksaa, maksu vapautetaan
                palveluntarjoajalle miinus komissio.
              </p>
            </div>

            <div className="slide-card p-10 flex flex-col">
              <span className="type-label text-slide-gray-400 mb-2">Tulovirta 2</span>
              <span className="type-metric text-slide-gray-900">€49-199</span>
              <h3 className="type-h3 text-slide-gray-900 mt-2 mb-4">Pro-tilaukset /kk</h3>
              <p className="type-body text-slide-gray-500 leading-relaxed">
                Palveluntarjoajille: prioriteettinäkyvyys, analytiikka, CRM-työkalut
                ja sähköpostikampanjat.
              </p>
            </div>

            <div className="slide-card p-10 flex flex-col">
              <span className="type-label text-slide-gray-400 mb-2">Tulovirta 3</span>
              <span className="type-metric text-slide-gray-900">Shop</span>
              <h3 className="type-h3 text-slide-gray-900 mt-2 mb-4">Verkkokauppa</h3>
              <p className="type-body text-slide-gray-500 leading-relaxed">
                Valmistuotteiden myynti — 3D-tulostetut esineet ja tarvikkeet.
                Suora D2C-kanava.
              </p>
            </div>

            <div className="slide-card p-10 flex flex-col">
              <span className="type-label text-slide-gray-400 mb-2">Tulovirta 4</span>
              <span className="type-metric text-slide-gray-900">B2B</span>
              <h3 className="type-h3 text-slide-gray-900 mt-2 mb-4">Yritystilit</h3>
              <p className="type-body text-slide-gray-500 leading-relaxed">
                Räätälöidyt yrityssopimukset, API-integraatiot,
                volyymiperusteinen hinnoittelu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
