import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import designImage from '@/assets/3d-design-industrial.jpg';

export default function Slide12DesignShowcase() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex h-full">
        {/* Left - Text content */}
        <div className="w-[45%] flex flex-col justify-center px-20 py-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-slide-accent-light" />
              <span className="type-caption text-slide-accent-light tracking-widest uppercase">
                3D-suunnittelu
              </span>
            </div>

            <h2 className="type-h1 text-white leading-tight">
              Suunnitelmasta tuotantoon
            </h2>

            <p className="type-body-lg text-white/60 leading-relaxed">
              Mittamuoto yhdistää 3D-suunnittelun ja valmistuksen. Tilaaja lataa CAD-mallin, 
              palveluntarjoajat kilpailuttavat tuotannon — kaikki yhdellä alustalla.
            </p>

            <div className="space-y-5 pt-4">
              {[
                'CAD / STL / STEP -tiedostojen tuki',
                'Automaattinen tarjouspyyntö verkostolle',
                'Laadunvalvonta ja hyväksyntäprosessi',
                'Teollisuuden vaatimukset täyttävä tuotanto',
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
                  <span className="type-body text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Image */}
        <div className="w-[55%] relative">
          <img
            src={designImage}
            alt="3D CAD design - wireframe to solid model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slide-primary via-transparent to-transparent" />
        </div>
      </div>
    </MSSlideLayout>
  );
}
