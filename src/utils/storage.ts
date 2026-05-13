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
  transactions: [
    // Otis transactions
    {
      "id": "otis-income-1", "childId": "otis", "type": "income", 
      "amount": 5.0, "description": "Wekelijks zakgeld week 1", "category": "Zakgeld",
      "date": "2024-12-01"
    },
    {
      "id": "otis-income-2", "childId": "otis", "type": "income", 
      "amount": 5.0, "description": "Wekelijks zakgeld week 2", "category": "Zakgeld",
      "date": "2024-12-08"
    },
    {
      "id": "otis-expense-1", "childId": "otis", "type": "expense",
      "amount": 3.50, "description": "Pokemonkaarten booster pack", "category": "Pokemonkaarten", 
      "date": "2024-12-03"
    },
    {
      "id": "otis-income-3", "childId": "otis", "type": "income",
      "amount": 15.0, "description": "Opa en oma cadeaugeld", "category": "Cadeau",
      "date": "2024-12-10"
    },
    {
      "id": "otis-expense-2", "childId": "otis", "type": "expense",
      "amount": 7.25, "description": "LEGO mini figuren", "category": "Speelgoed",
      "date": "2024-12-12"
    },
    // Bavo transactions
    {
      "id": "bavo-income-1", "childId": "bavo", "type": "income",
      "amount": 4.0, "description": "Wekelijks zakgeld week 1", "category": "Zakgeld",
      "date": "2024-12-01"
    },
    {
      "id": "bavo-income-2", "childId": "bavo", "type": "income",
      "amount": 4.0, "description": "Wekelijks zakgeld week 2", "category": "Zakgeld",
      "date": "2024-12-08"
    },
    {
      "id": "bavo-expense-1", "childId": "bavo", "type": "expense", 
      "amount": 2.50, "description": "Snoep bij tankstation", "category": "Snacks",
      "date": "2024-12-05"
    },
    {
      "id": "bavo-income-3", "childId": "bavo", "type": "income",
      "amount": 10.0, "description": "Sinterklaas geld", "category": "Cadeau", 
      "date": "2024-12-06"
    },
    // Annabel transactions
    {
      "id": "annabel-income-1", "childId": "annabel", "type": "income",
      "amount": 3.0, "description": "Wekelijks zakgeld week 1", "category": "Zakgeld", 
      "date": "2024-12-01"
    },
    {
      "id": "annabel-income-2", "childId": "annabel", "type": "income",
      "amount": 3.0, "description": "Wekelijks zakgeld week 2", "category": "Zakgeld",
      "date": "2024-12-08"
    },
    {
      "id": "annabel-expense-1", "childId": "annabel", "type": "expense",
      "amount": 1.75, "description": "Stickers boekje", "category": "Speelgoed",
      "date": "2024-12-04"
    },
    {
      "id": "annabel-income-3", "childId": "annabel", "type": "income", 
      "amount": 8.0, "description": "Kerstcadeaugeld van tante", "category": "Cadeau",
      "date": "2024-12-11"
    }
  ],
  savingsGoals: [],
  categories: {
    income: ['Zakgeld', 'Cadeau', 'Uit spaarpot', 'Verjaardagsgeld', 'Kerst', 'Sinterklaas', 'Rapport bonus'],
    expense: ['Speelgoed', 'Pokemonkaarten', 'Snacks', 'Kleding', 'Boeken', 'Uitstapje', 'LEGO', 'Stickers']
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
