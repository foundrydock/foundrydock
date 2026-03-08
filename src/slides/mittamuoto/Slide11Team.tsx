import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { User } from 'lucide-react';

const team = [
  {
    name: 'Jani Perho',
    title: 'CEO',
    description: 'Liiketoiminnan kehitys ja strategia',
  },
  {
    name: 'Thomas Toivanen',
    title: 'CTO',
    description: 'Teknologia ja arkkitehtuuri',
  },
  {
    name: 'Mikko Ukkonen',
    title: 'Technical Lead',
    description: 'Tuotekehitys ja toteutus',
  },
  {
    name: 'Mikael Korte',
    title: 'CFO',
    description: 'Talous ja rahoitus',
  },
];

export default function Slide11Team() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-slide-accent" />
            <span className="type-caption text-slide-gray-600 tracking-widest uppercase">
              Tiimi
            </span>
          </div>
          <h2 className="type-h1 text-slide-gray-900">
            Kokenut tiimi rakentamassa tulevaisuutta
          </h2>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-4 gap-12 flex-1 items-start">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              {/* Avatar placeholder */}
              <div className="w-40 h-40 rounded-full bg-slide-accent-muted flex items-center justify-center mb-8">
                <User className="w-16 h-16 text-slide-accent" strokeWidth={1.5} />
              </div>

              {/* Name */}
              <h3 className="type-h3 text-slide-gray-900 mb-2">
                {member.name}
              </h3>

              {/* Title */}
              <span className="type-body-lg text-slide-accent font-semibold mb-4">
                {member.title}
              </span>

              {/* Description */}
              <p className="type-body text-slide-gray-500">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
