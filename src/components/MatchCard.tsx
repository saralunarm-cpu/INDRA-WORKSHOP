import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { PersonChip } from './PersonChip';
import { usePointerTilt } from '../hooks/usePointerTilt';
import type { CategoryMatch } from '../types/community';

type MatchCardProps = {
  match: CategoryMatch;
  isFeatured: boolean;
  activePersonId: string | null;
  onActivatePerson: (personId: string | null) => void;
};

export function MatchCard({ match, isFeatured, activePersonId, onActivatePerson }: MatchCardProps) {
  const { tiltProps, tiltStyle, isHovered, reduceMotion } = usePointerTilt(3.5);
  const { category, needs, gives } = match;

  return (
    <div className={`[perspective:1200px] ${isFeatured ? 'md:col-span-2' : ''}`}>
      <motion.article
        {...tiltProps}
        style={tiltStyle}
        animate={reduceMotion ? undefined : { y: isHovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative h-full overflow-hidden rounded-[20px] border border-line bg-surface p-6 pl-7 shadow-[0_16px_34px_-26px_rgba(23,24,18,0.45)] sm:p-7 sm:pl-8">
        
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ backgroundColor: category.color }} />
        

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3
            className="font-display text-xl font-semibold tracking-[-0.01em]"
            style={{ color: category.text }}>
            
            {category.label}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            {gives.length} {gives.length === 1 ? 'ofrece' : 'ofrecen'} · {needs.length}{' '}
            {needs.length === 1 ? 'pide' : 'piden'}
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">Necesitan</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {needs.map((person) =>
              <PersonChip
                key={person.id}
                person={person}
                tone="need"
                category={category}
                isActive={activePersonId === person.id}
                onActivate={onActivatePerson} />

              )}
            </div>
          </div>

          <ArrowRightIcon
            aria-hidden="true"
            className="h-5 w-5 rotate-90 justify-self-center sm:mt-7 sm:rotate-0"
            style={{ color: category.color }} />
          

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
              {gives.length === 1 ? 'Puede dar' : 'Pueden dar'}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {gives.map((person) =>
              <PersonChip
                key={person.id}
                person={person}
                tone="give"
                category={category}
                isActive={activePersonId === person.id}
                onActivate={onActivatePerson} />

              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>);

}