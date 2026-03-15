import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { User } from 'lucide-react';
import { T } from '@/components/slides/EditableText';
import { EditableImage } from '@/components/slides/EditableImage';

const team = [
  { key: 'jani',   name: 'Jani Perho',      title: 'CEO',            descKey: 'team.jani.desc' },
  { key: 'thomas', name: 'Thomas Toivanen',  title: 'CTO',            descKey: 'team.thomas.desc' },
  { key: 'mikko',  name: 'Mikko Ukkonen',    title: 'Technical Lead', descKey: 'team.mikko.desc' },
  { key: 'mikael', name: 'Mikael Korte',     title: 'CFO',            descKey: 'team.mikael.desc' },
];

export default function Slide11Team() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-slide-accent" />
            <T k="team.section" className="type-caption text-slide-gray-600 tracking-widest uppercase" />
          </div>
          <T k="team.title" as="h2" className="type-h1 text-slide-gray-900" />
        </div>

        <div className="grid grid-cols-4 gap-12 flex-1 items-start">
          {team.map((member) => (
            <div key={member.key} className="flex flex-col items-center text-center">
              <EditableImage
                imageKey={`team.${member.key}.photo`}
                alt={member.name}
                className="w-40 h-40 rounded-full object-cover object-top"
                renderPlaceholder={() => (
                  <div className="w-40 h-40 rounded-full bg-slide-accent-muted flex items-center justify-center">
                    <User className="w-16 h-16 text-slide-accent" strokeWidth={1.5} />
                  </div>
                )}
              />
              <div className="mb-8" /> {/* spacing after photo */}
              <h3 className="type-h3 text-slide-gray-900 mb-2">{member.name}</h3>
              <span className="type-body-lg text-slide-accent font-semibold mb-4">{member.title}</span>
              <T k={member.descKey} as="p" className="type-body text-slide-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
