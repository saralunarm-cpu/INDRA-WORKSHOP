import { categories } from '../data/community';
import type { CategoryGap, CategoryMatch, Person } from '../types/community';

/**
 * Cruces posibles: categorías donde al menos una persona pide
 * y al menos otra puede dar. Se recalculan con cada perfil nuevo.
 */
export function buildMatches(people: Person[]): CategoryMatch[] {
  return categories.
  map((category) => ({
    category,
    needs: people.filter((person) => person.needs.includes(category.id)),
    gives: people.filter((person) => person.offers.includes(category.id))
  })).
  filter((match) => match.needs.length > 0 && match.gives.length > 0).
  sort((a, b) => b.needs.length + b.gives.length - (a.needs.length + a.gives.length));
}

/** Categorías con demanda abierta y todavía sin nadie que ofrezca. */
export function buildGaps(people: Person[]): CategoryGap[] {
  return categories.
  map((category) => ({
    category,
    needs: people.filter((person) => person.needs.includes(category.id)),
    hasGivers: people.some((person) => person.offers.includes(category.id))
  })).
  filter((gap) => gap.needs.length > 0 && !gap.hasGivers).
  map(({ category, needs }) => ({ category, needs }));
}

export function countExchanges(matches: CategoryMatch[]): number {
  return matches.reduce((total, match) => total + match.needs.length * match.gives.length, 0);
}