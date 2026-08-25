import React from 'react';
import { HandHeartIcon } from 'lucide-react';
import type { CategoryGap } from '../types/community';

type GapsPanelProps = {
  gaps: CategoryGap[];
};

export function GapsPanel({ gaps }: GapsPanelProps) {
  if (gaps.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface-alt p-6">
        <p className="text-sm text-ink-soft">
          Ahora mismo cada necesidad publicada tiene al menos una persona que puede responder.
        </p>
      </div>);

  }

  return (
    <section aria-labelledby="brechas" className="mt-6 rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-tint text-brand-strong">
          <HandHeartIcon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        <div>
          <h3 id="brechas" className="font-display text-lg font-semibold tracking-[-0.01em]">
            Aquí falta quien pueda dar
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Necesidades publicadas que todavía nadie en la red puede cubrir.
          </p>
        </div>
      </div>

      <ul className="mt-5 divide-y divide-line border-t border-line">
        {gaps.map(({ category, needs }) =>
        <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
            <span className="inline-flex items-center gap-2.5 text-[15px] font-semibold" style={{ color: category.text }}>
              <span
              aria-hidden="true"
              className="h-2.5 w-2.5 flex-none rounded-full"
              style={{ backgroundColor: category.color }} />
            
              {category.label}
            </span>
            <span className="text-sm text-ink-soft">
              Lo pide {needs.map((person) => person.name).join(', ')}
            </span>
          </li>
        )}
      </ul>
    </section>);

}