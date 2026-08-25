export type CategoryId =
'idioma' |
'comida' |
'movilidad' |
'media' |
'jardin' |
'comunidad' |
'salud' |
'tramites' |
'tecnologia' |
'vivienda' |
'empleo' |
'educacion' |
'familia' |
'ropa' |
'legal';

export type Category = {
  id: CategoryId;
  label: string;
  /** Color vivo, para puntos y barras de acento. */
  color: string;
  /** Variante oscura, legible sobre fondos claros. */
  text: string;
};

export type Person = {
  id: string;
  name: string;
  initial: string;
  city: string;
  isFounder: boolean;
  accent: CategoryId;
  offers: CategoryId[];
  offerDetail: string;
  needs: CategoryId[];
  bio: string;
  email: string;
};

export type CategoryMatch = {
  category: Category;
  needs: Person[];
  gives: Person[];
};

export type CategoryGap = {
  category: Category;
  needs: Person[];
};