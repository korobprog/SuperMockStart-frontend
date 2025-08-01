declare module 'countries-list' {
  export interface Country {
    name: string;
    native: string;
    phone: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string[];
  }

  export interface Language {
    name: string;
    native: string;
  }

  export interface Continent {
    name: string;
  }

  export const countries: { [code: string]: Country };
  export const languages: { [code: string]: Language };
  export const continents: { [code: string]: Continent };
} 