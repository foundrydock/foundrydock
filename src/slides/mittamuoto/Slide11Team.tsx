import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { User } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

const team = [
  { name: 'Jani Perho', title: 'CEO', descKey: 'team.jani.desc' },
  { name: 'Thomas Toivanen', title: 'CTO', descKey: 'team.thomas.desc' },
  { name: 'Mikko Ukkonen', title: 'Technical Lead', descKey: 'team.mikko.desc' },
  { name: 'Mikael Korte', title: 'CFO', descKey: 'team.mikael.desc' },
];

export default function Slide11Team() {
  const { t } = useLanguage();

  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-slide-accent" />
            <span className="type-caption text-slide-gray-600 tracking-widest uppercase">{t('team.section')}</span>
          </div>
          <h2 className="type-h1 text-slide-gray-900">{t('team.title')}</h2>
        </div>

        <div className="grid grid-cols-4 gap-12 flex-1 items-start">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full bg-slide-accent-muted flex items-center justify-center mb-8">
                <User className="w-16 h-16 text-slide-accent" strokeWidth={1.5} />
              </div>
              <h3 className="type-h3 text-slide-gray-900 mb-2">{member.name}</h3>
              <span className="type-body-lg text-slide-accent font-semibold mb-4">{member.title}</span>
              <p className="type-body text-slide-gray-600">{t(member.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
