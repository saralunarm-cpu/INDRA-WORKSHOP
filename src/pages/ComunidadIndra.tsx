import React, { useMemo, useState, useEffect } from 'react';
import { CommunityHero } from '../components/CommunityHero';
import { CategoryFilter } from '../components/CategoryFilter';
import { MatchCard } from '../components/MatchCard';
import { GapsPanel } from '../components/GapsPanel';
import { ProfileCard } from '../components/ProfileCard';
import { people as seedPeople } from '../data/community';
import { buildGaps, buildMatches, countExchanges } from '../utils/matches';
import type { CategoryId, Person } from '../types/community';

export const FORM_URL = 'https://forms.gle/eyE4qSYDDNQDJ3Hi6';

export function ComunidadIndra() {
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [people, setPeople] = useState<Person[]>(seedPeople);

  useEffect(() => {
    fetch('/api/responses')
      .then((r) => r.json())
      .then((d) => {
        if (d && Array.isArray(d.people) && d.people.length) setPeople(d.people as Person[]);
      })
      .catch(() => {});
  }, []);

  const matches = useMemo(() => buildMatches(people), [people]);
  const gaps = useMemo(() => buildGaps(people), [people]);
  const exchangeCount = useMemo(() => countExchanges(matches), [matches]);

  const visibleMatches = activeCategory ?
  matches.filter((match) => match.category.id === activeCategory) :
  matches;

  const activePerson = people.find((person) => person.id === activePersonId) ?? null;

  return (
    <div className="min-h-screen w-full bg-canvas font-sans text-ink">
      <CommunityHero
        peopleCount={people.length}
        matchCount={exchangeCount}
        categoryCount={matches.length} />
      

      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <section aria-labelledby="encuentros" className="pt-16 sm:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <h2
                id="encuentros"
                className="font-display text-[clamp(1.6rem,3.4vw,2.15rem)] font-semibold tracking-[-0.025em]">
                
                Encuentros de la comunidad
              </h2>
              <p className="mt-2 max-w-[62ch] text-ink-soft">
                Cruces posibles entre lo que unas personas ofrecen y lo que otras necesitan. Se calculan solos
                con cada nuevo perfil.
              </p>
            </div>
            <p aria-live="polite" className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
              {activePerson ? `Resaltando a ${activePerson.name}` : 'Pasa sobre un nombre para seguirlo'}
            </p>
          </div>

          <CategoryFilter
            categories={matches.map((match) => match.category)}
            activeCategory={activeCategory}
            onSelect={setActiveCategory} />
          

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5">
            {visibleMatches.map((match, index) =>
            <MatchCard
              key={match.category.id}
              match={match}
              isFeatured={!activeCategory && index === 0}
              activePersonId={activePersonId}
              onActivatePerson={setActivePersonId} />

            )}
          </div>

          <GapsPanel gaps={gaps} />
        </section>

        <section aria-labelledby="perfiles" className="pt-16 sm:pt-20">
          <div className="border-b border-line pb-5">
            <h2
              id="perfiles"
              className="font-display text-[clamp(1.6rem,3.4vw,2.15rem)] font-semibold tracking-[-0.025em]">
              
              Perfiles de la comunidad
            </h2>
            <p className="mt-2 max-w-[62ch] text-ink-soft">
              Quienes ya son parte de la red, con sus habilidades y lo que ofrecen.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {people.map((person) =>
            <ProfileCard
              key={person.id}
              person={person}
              isHighlighted={activePersonId === person.id}
              onActivatePerson={setActivePersonId} />

            )}
          </div>
        </section>

        <section
          id="publicar-perfil"
          className="mt-20 rounded-[22px] border border-line bg-surface px-6 py-12 text-center sm:px-10">
          
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.025em]">
            ¿Qué puedes aportar tú?
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-ink-soft">
            Publica tu perfil con lo que ofreces y lo que buscas. La red calculará tus encuentros al instante.
          </p>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 ease-out hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-4 focus-visible:ring-offset-surface">

            Publica tu perfil
          </a>
        </section>
      </main>

      <footer className="border-t border-line bg-surface py-10 text-center text-sm leading-relaxed text-ink-soft">
        <p>Indra · Red de reciprocidad — Casa de la Cultura Latinoamericana</p>
        <p className="mt-1">Mientras más das, más recibes.</p>
      </footer>
    </div>);

}