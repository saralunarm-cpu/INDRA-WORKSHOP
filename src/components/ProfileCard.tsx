import React from 'react';
import { motion } from 'framer-motion';
import { MailIcon } from 'lucide-react';
import { categoryMap } from '../data/community';
import { usePointerTilt } from '../hooks/usePointerTilt';
import type { Person } from '../types/community';

type ProfileCardProps = {
  person: Person;
  isHighlighted: boolean;
  onActivatePerson: (personId: string | null) => void;
};

export function ProfileCard({ person, isHighlighted, onActivatePerson }: ProfileCardProps) {
  const { tiltProps, tiltStyle, isHovered, reduceMotion } = usePointerTilt(4);
  const accent = categoryMap[person.accent];

  return (
    <div className="[perspective:1200px]">
      <motion.article
        {...tiltProps}
        style={tiltStyle}
        animate={reduceMotion ? undefined : { y: isHovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onFocus={() => onActivatePerson(person.id)}
        onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && onActivatePerson(null)}
        className={`flex h-full flex-col gap-4 rounded-[18px] border bg-surface p-6 shadow-[0_16px_34px_-26px_rgba(23,24,18,0.45)] transition-colors duration-150 ease-out ${
        isHighlighted ? 'border-brand-strong' : 'border-line'}`
        }>
        
        <span
          aria-hidden="true"
          className="h-1 w-11 rounded-full"
          style={{ backgroundColor: accent.color }} />
        

        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-display text-base font-bold text-surface"
            style={{ backgroundColor: accent.text }}>
            
            {person.initial}
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight tracking-[-0.015em]">
              {person.name}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-soft">
              {person.city}
              {person.isFounder &&
              <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-strong">
                  Fundador/a
                </span>
              }
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">Ofrezco</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {person.offers.map((offerId) => {
              const category = categoryMap[offerId];
              return (
                <span
                  key={offerId}
                  className="rounded-full border px-2.5 py-1 text-[13px] font-semibold"
                  style={{
                    color: category.text,
                    backgroundColor: `${category.color}1a`,
                    borderColor: `${category.color}40`
                  }}>
                  
                  {category.label}
                </span>);

            })}
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{person.offerDetail}</p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">Busco</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {person.needs.map((needId) =>
            <span
              key={needId}
              className="rounded-full border border-line bg-surface-alt px-2.5 py-1 text-[13px] font-semibold text-ink">
              
                {categoryMap[needId].label}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm italic leading-relaxed text-ink-soft">“{person.bio}”</p>

        <div className="mt-auto border-t border-dashed border-line pt-4">
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-strong transition-colors duration-150 ease-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
            
            <MailIcon aria-hidden="true" className="h-4 w-4" />
            Escribir a {person.name}
          </a>
        </div>
      </motion.article>
    </div>);

}