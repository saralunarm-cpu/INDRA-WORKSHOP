import type { Category, CategoryId, Person } from '../types/community';

export const categories: Category[] = [
{ id: 'idioma', label: 'Idioma / Alemán', color: '#2E6BE6', text: '#1D4FB8' },
{ id: 'comida', label: 'Comida', color: '#F5731F', text: '#A8480B' },
{ id: 'movilidad', label: 'Movilidad', color: '#12BEC6', text: '#0B7A80' },
{ id: 'media', label: 'Video / Foto / Media', color: '#E63DA6', text: '#A81A72' },
{ id: 'jardin', label: 'Jardín', color: '#16B57F', text: '#0B7554' },
{ id: 'comunidad', label: 'Comunidad', color: '#6C4CE0', text: '#4A2FB0' },
{ id: 'salud', label: 'Salud', color: '#F0456B', text: '#B01A3C' },
{ id: 'tramites', label: 'Trámites', color: '#F0A81E', text: '#8A5D06' },
{ id: 'tecnologia', label: 'Tecnología', color: '#1AA7E8', text: '#0F6E9B' },
{ id: 'vivienda', label: 'Vivienda y alojamiento', color: '#4F5BD6', text: '#363FA6' },
{ id: 'empleo', label: 'Empleo y trabajo', color: '#C79A1E', text: '#7E610D' },
{ id: 'educacion', label: 'Educación y clases', color: '#B23DD8', text: '#7C2497' },
{ id: 'familia', label: 'Familia y niñez', color: '#F26095', text: '#B02660' },
{ id: 'ropa', label: 'Ropa y objetos', color: '#8C7BF0', text: '#5B4CC0' },
{ id: 'legal', label: 'Legal y migración', color: '#5B7089', text: '#3D4E63' }];


export const categoryMap: Record<CategoryId, Category> = categories.reduce(
  (map, category) => ({ ...map, [category.id]: category }),
  {} as Record<CategoryId, Category>
);

export const people: Person[] = [
{
  id: 'paul',
  name: 'Paul',
  initial: 'P',
  city: 'Berlín',
  isFounder: true,
  accent: 'movilidad',
  offers: ['movilidad', 'comida', 'idioma', 'vivienda'],
  offerDetail: 'Construcción, ingeniería civil, licencia y carro, cocina, alemán',
  needs: ['comida'],
  bio: 'Construcción de casas, ingeniería civil y trabajo físico.',
  email: 'schwarzpail.paul@googlemail.com'
},
{
  id: 'marita',
  name: 'Marita',
  initial: 'M',
  city: 'Berlín',
  isFounder: true,
  accent: 'jardin',
  offers: ['jardin', 'idioma', 'movilidad'],
  offerDetail: 'Jardín, gramática de alemán y español, traducción, conducción',
  needs: ['tecnologia'],
  bio: 'Jardín, traducción y gramática de alemán y español.',
  email: 'mradajewshi@googlemail.com'
},
{
  id: 'marilyn',
  name: 'Marilyn',
  initial: 'M',
  city: 'Berlín',
  isFounder: true,
  accent: 'comunidad',
  offers: ['comunidad', 'comida', 'media', 'educacion'],
  offerDetail: 'Conexiones y contactos, arte terapia, arepas, karaoke, radio digital',
  needs: ['media', 'movilidad', 'jardin'],
  bio: 'Conexiones de comunidades y artistas, arte terapia y radio digital.',
  email: 'marilyn@masterpeace.org'
},
{
  id: 'rebeca',
  name: 'Rebeca',
  initial: 'R',
  city: 'Berlín',
  isFounder: true,
  accent: 'media',
  offers: ['media', 'comida', 'ropa', 'tramites'],
  offerDetail: 'Videos y edición, comida de Brasil, croché, asesoría en burocracia',
  needs: ['empleo', 'tramites', 'idioma'],
  bio: 'Videos y edición, comida de Brasil, croché y burocracia.',
  email: 'rebecca.desantana@gmail.com'
},
{
  id: 'dolly',
  name: 'Dolly',
  initial: 'D',
  city: 'Berlín',
  isFounder: true,
  accent: 'comida',
  offers: ['comida', 'idioma', 'legal', 'comunidad'],
  offerDetail: 'Sopita y café, libros, vida alemana, visas, organizaciones',
  needs: ['comunidad', 'media'],
  bio: 'Sopita y café, vida alemana, visas y organizaciones.',
  email: 'berlin@casalatinoamericana.de'
},
{
  id: 'alfonso',
  name: 'Alfonso',
  initial: 'A',
  city: 'Berlín',
  isFounder: true,
  accent: 'comunidad',
  offers: ['comunidad', 'comida', 'jardin'],
  offerDetail: 'Procesos de organización, cocina, medio ambiente',
  needs: ['idioma', 'salud'],
  bio: 'Procesos de organización, cocina y medio ambiente.',
  email: 'intercambiojusto@yahoo.es'
}];