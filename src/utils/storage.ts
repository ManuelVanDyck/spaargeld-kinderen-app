import type { AppData } from '../types';

const STORAGE_KEY = 'spaargeld-app-data';

export const defaultAppData: AppData = {
  children: [
    {
      id: 'otis',
      name: 'Otis',
      birthDate: '2016-01-01',
      currentBalance: 0,
      profileColor: '#3b82f6'
    },
    {
      id: 'bavo',
      name: 'Bavo',
      birthDate: '2017-01-01',
      currentBalance: 0,
      profileColor: '#10b981'
    },
    {
      id: 'annabel',
      name: 'Annabel',
      birthDate: '2018-01-01',
      currentBalance: 0,
      profileColor: '#f59e0b'
    }
  ],
  transactions: [],
  savingsGoals: [],
  categories: {
    income: ['Zakgeld', 'Cadeau', 'Uit spaarpot', 'Verjaardagsgeld', 'Kerst', 'Rapport bonus'],
    expense: ['Speelgoed', 'Pokemonkaarten', 'Snacks', 'Kleding', 'Boeken', 'Uitstapje']
  },
  lastBackup: new Date().toISOString()
};

export const loadAppData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultAppData;

    const parsed = JSON.parse(stored) as AppData;
    return {
      ...defaultAppData,
      ...parsed
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return defaultAppData;
  }
};

export const saveAppData = (data: AppData): void => {
  try {
    const dataToSave = {
      ...data,
      lastBackup: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const exportToJSON = (data: AppData): string => {
  return JSON.stringify(data, null, 2);
};
