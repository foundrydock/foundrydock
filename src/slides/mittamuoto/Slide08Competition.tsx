import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Check, X, Minus } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

function CellIcon({ value }: { value: 'yes' | 'no' | 'partial' }) {
  if (value === 'yes') return <Check className="w-6 h-6 text-slide-gray-900 mx-auto" strokeWidth={2.5} />;
  if (value === 'partial') return <Minus className="w-6 h-6 text-slide-gray-400 mx-auto" strokeWidth={2.5} />;
  return <X className="w-6 h-6 text-slide-gray-300 mx-auto" strokeWidth={2} />;
}

export default function Slide08Competition() {
  const { t } = useLanguage();

  const rows = [
    { key: 'f1', m: 'yes', c: 'no', h: 'no', p: 'no' },
    { key: 'f2', m: 'yes', c: 'no', h: 'no', p: 'yes' },
    { key: 'f3', m: 'yes', c: 'no', h: 'no', p: 'no' },
    { key: 'f4', m: 'yes', c: 'no', h: 'yes', p: 'no' },
    { key: 'f5', m: 'yes', c: 'no', h: 'no', p: 'no' },
    { key: 'f6', m: 'yes', c: 'partial', h: 'yes', p: 'yes' },
    { key: 'f7', m: 'yes', c: 'no', h: 'no', p: 'no' },
    { key: 'f8', m: 'yes', c: 'no', h: 'no', p: 'yes' },
  ] as const;

  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-10">
          <span className="type-caption text-slide-accent tracking-widest uppercase">{t('comp.section')}</span>
          <h2 className="type-h1 mt-4 text-slide-gray-900">{t('comp.title')}</h2>
        </div>

        <div className="flex-1">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slide-gray-200">
                <th className="type-body font-semibold text-slide-gray-900 text-left py-5 w-[280px]">{t('comp.header')}</th>
                <th className="type-body font-semibold text-slide-accent text-center py-5 bg-slide-accent/5 rounded-t-lg">Mittamuoto</th>
                <th className="type-body font-semibold text-slide-gray-500 text-center py-5">Craftcloud</th>
                <th className="type-body font-semibold text-slide-gray-500 text-center py-5">Hubs (Protolabs)</th>
                <th className="type-body font-semibold text-slide-gray-500 text-center py-5">{t('comp.traditional')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-b border-slide-gray-100">
                  <td className="type-body text-slide-gray-700 py-4">{t(`comp.${row.key}`)}</td>
                  <td className="py-4 bg-slide-accent/5"><CellIcon value={row.m} /></td>
                  <td className="py-4"><CellIcon value={row.c} /></td>
                  <td className="py-4"><CellIcon value={row.h} /></td>
                  <td className="py-4"><CellIcon value={row.p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MSSlideLayout>
  );
}
