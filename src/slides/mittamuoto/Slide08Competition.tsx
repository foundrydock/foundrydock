import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide08Competition() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-10">
          <span className="type-caption text-slide-accent tracking-widest uppercase">07 — Kilpailukenttä</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">
            Pohjoismaisessa markkinassa ei ole vastaaavaa
          </h2>
        </div>

        {/* Comparison table */}
        <div className="flex-1">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slide-gray-200">
                <th className="type-body font-semibold text-slide-gray-900 text-left py-5 w-[280px]">Ominaisuus</th>
                <th className="type-body font-semibold text-slide-accent text-center py-5 bg-slide-accent/5 rounded-t-lg">Mittamuoto</th>
                <th className="type-body font-semibold text-slide-gray-500 text-center py-5">Craftcloud</th>
                <th className="type-body font-semibold text-slide-gray-500 text-center py-5">Hubs (Protolabs)</th>
                <th className="type-body font-semibold text-slide-gray-500 text-center py-5">Perinteiset</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Kilpailutus (useita tarjouksia)', m: '✅', c: '❌', h: '❌', p: '❌' },
                { feature: 'Suomalainen / pohjoismainen', m: '✅', c: '❌', h: '❌', p: '✅' },
                { feature: 'Escrow-maksusuoja', m: '✅', c: '❌', h: '❌', p: '❌' },
                { feature: 'Arvostelujärjestelmä', m: '✅', c: '❌', h: '✅', p: '❌' },
                { feature: 'Posti-integraatio (FI)', m: '✅', c: '❌', h: '❌', p: '❌' },
                { feature: 'B2B + yritystilaus', m: '✅', c: '⚠️', h: '✅', p: '✅' },
                { feature: 'Visualisointipalvelut', m: '✅', c: '❌', h: '❌', p: '❌' },
                { feature: 'Y-tunnuslaskutus', m: '✅', c: '❌', h: '❌', p: '✅' },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-slide-gray-100">
                  <td className="type-body text-slide-gray-700 py-4">{row.feature}</td>
                  <td className="type-body text-center py-4 bg-slide-accent/5 text-[28px]">{row.m}</td>
                  <td className="type-body text-center py-4 text-[28px]">{row.c}</td>
                  <td className="type-body text-center py-4 text-[28px]">{row.h}</td>
                  <td className="type-body text-center py-4 text-[28px]">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MSSlideLayout>
  );
}
