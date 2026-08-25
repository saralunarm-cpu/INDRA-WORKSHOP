import React from 'react';
import type { Category, CategoryId } from '../types/community';

type CategoryFilterProps = {
  categories: Category[];
  activeCategory: CategoryId | null;
  onSelect: (categoryId: CategoryId | null) => void;
};

export function CategoryFilter({ categories, activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="mt-7 rounded-2xl border border-line bg-surface-alt p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        Categorías de intercambio
      </p>
      <div className="mt-3.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={activeCategory === null}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface-alt ${
          activeCategory === null ?
          'border-ink bg-ink text-surface' :
          'border-line bg-surface text-ink-soft hover:border-ink/40 hover:text-ink'}`
          }>
          
          Todas
        </button>

        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(isActive ? null : category.id)}
              aria-pressed={isActive}
              style={
              isActive ?
              { borderColor: category.text, backgroundColor: `${category.color}1f`, color: category.text } :
              undefined
              }
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-surface-alt ${
              isActive ? '' : 'border-line bg-surface text-ink hover:border-ink/35'}`
              }>
              
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 flex-none rounded-full"
                style={{ backgroundColor: category.color }} />
              
              {category.label}
            </button>);

        })}
      </div>
    </div>);

}