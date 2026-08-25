import React from 'react';
import type { Category, Person } from '../types/community';

type PersonChipProps = {
  person: Person;
  tone: 'need' | 'give';
  category: Category;
  isActive: boolean;
  onActivate: (personId: string | null) => void;
};

export function PersonChip({ person, tone, category, isActive, onActivate }: PersonChipProps) {
  const giveStyle = {
    color: category.text,
    backgroundColor: `${category.color}1a`,
    borderColor: isActive ? category.text : `${category.color}40`
  };

  return (
    <button
      type="button"
      onPointerEnter={(event) => event.pointerType === 'mouse' && onActivate(person.id)}
      onPointerLeave={() => onActivate(null)}
      onFocus={() => onActivate(person.id)}
      onBlur={() => onActivate(null)}
      aria-label={`${person.name} — ver su presencia en la red`}
      style={tone === 'give' ? giveStyle : undefined}
      className={`rounded-full border px-3 py-1 text-sm font-semibold transition-[transform,border-color,background-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
      isActive ? 'scale-[1.04]' : ''} ${

      tone === 'need' ?
      `border-line bg-surface-alt text-ink ${isActive ? 'border-ink/45' : ''}` :
      ''}`
      }>
      
      {person.name}
    </button>);

}