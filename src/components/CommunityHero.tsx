import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';

const HERO_IMAGE = "/d38f5a43-1cca-43b8-a488-ca3f49dcae2b.jpg";

type CommunityHeroProps = {
  peopleCount: number;
  matchCount: number;
  categoryCount: number;
};

export function CommunityHero({ peopleCount, matchCount, categoryCount }: CommunityHeroProps) {
  const reduceMotion = useReducedMotion();
  const stats = [
  { value: peopleCount, label: 'Perfiles en la red' },
  { value: matchCount, label: 'Encuentros posibles' },
  { value: categoryCount, label: 'Categorías activas' }];


  return (
    <header className="w-full bg-night text-cream">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}>
              
              <div className="flex items-center gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 32 32"
                  className="h-8 w-8 flex-none text-brand"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round">
                  
                  <path d="M16 2.5 29 16 16 29.5 3 16 16 2.5Z" />
                  <path d="M16 2.5V29.5M3 16h26" strokeWidth="1" opacity="0.6" />
                </svg>
                <p className="font-display text-[26px] font-bold uppercase leading-none tracking-[0.16em] text-cream">
                  Indra
                </p>
              </div>
              <p className="mt-4 max-w-[40ch] border-l-2 border-brand pl-3 text-[13px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-cream/60">
                Autonomía comunitaria a través del saber compartido y el apoyo mutuo
              </p>
            </motion.div>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 font-display text-[clamp(2.6rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.04em]">
              
              Mientras <span className="text-brand">más das</span>, más{' '}
              <span className="text-brand">recibes</span>.
            </motion.h1>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}>
              
              <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-cream/70">
                La red donde cada quien aporta desde lo que tiene —sus saberes, sus manos o sus recursos— y
                recibe el apoyo de la comunidad.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="https://forms.gle/eyE4qSYDDNQDJ3Hi6"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-night shadow-[0_14px_28px_-16px_rgba(15,182,160,0.9)] transition-colors duration-200 ease-out hover:bg-[#3ED3C0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-night">

                  <PlusIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2.6} />
                  Súmate a Indra
                </a>
                <a
                  href="#encuentros"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3.5 text-sm font-semibold text-cream transition-colors duration-200 ease-out hover:border-cream/60 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-night">
                  
                  Ver los encuentros
                  <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>

              <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/[0.14] pt-7">
                {stats.map((stat) =>
                <div key={stat.label}>
                    <dt className="text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-cream/50">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-cream">
                      {stat.value}
                    </dd>
                  </div>
                )}
              </dl>
            </motion.div>
          </div>

          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="m-0 lg:justify-self-end">
            
            <div className="overflow-hidden rounded-[22px] border border-white/[0.14] bg-night-alt">
              <img
                src={HERO_IMAGE}
                alt="Personas de la comunidad intercambiando pan y verduras de la huerta alrededor de una mesa"
                className="aspect-[4/5] w-full object-cover" />
              
            </div>
            <figcaption className="mt-3 flex items-center gap-2.5 text-[12px] leading-relaxed text-cream/55">
              <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full bg-brand" />
              Encuentro semanal en la Casa de la Cultura Latinoamericana, Berlín.
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </header>);

}