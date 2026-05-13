import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AppData, Transaction, SavingsGoal } from '../types';
import { loadAppData, saveAppData } from '../utils/storage';

interface AppContextType {
  data: AppData;
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  calculateBalance: (childId: string) => number;
  getTransactions: (childId: string) => Transaction[];
  getSavingsGoals: (childId: string) => SavingsGoal[];
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

/**
 * Validates that a parsed JSON object has the basic shape of AppData.
 * Prevents corrupted data from being set via importData.
 */
const isValidAppDataShape = (value: unknown): value is AppData => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (!Array.isArray(obj.children)) return false;
  if (!Array.isArray(obj.transactions)) return false;
  if (!Array.isArray(obj.savingsGoals)) return false;

  if (typeof obj.categories !== 'object' || obj.categories === null) return false;
  const cats = obj.categories as Record<string, unknown>;
  if (!Array.isArray(cats.income) || !Array.isArray(cats.expense)) return false;

  if (typeof obj.lastBackup !== 'string') return false;

  return true;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // FIX #2a: Lazy state initialization — load from localStorage immediately,
  // so default data is never stored as initial state.
  const loaded = useMemo(() => loadAppData(), []);
  const [data, setData] = useState<AppData>(loaded);
  const initialChildId = loaded.children.length > 0 ? loaded.children[0].id : 'otis';
  const [selectedChildId, setSelectedChildId] = useState<string>(initialChildId);

  // FIX #2b: Ref to skip the very first save (data was just loaded, no need to re-save).
  const isFirstRender = useRef(true);

  // Save data whenever it changes — skip the first render to avoid overwriting
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveAppData(data);
  }, [data]);

  // FIX #5: Use crypto.randomUUID() for guaranteed unique IDs
  const generateId = useCallback((): string => {
    return crypto.randomUUID();
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };

    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  }, [generateId]);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: generateId(),
    };

    setData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal]
    }));
  }, [generateId]);

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g =>
        g.id === id ? { ...g, ...updates } : g
      )
    }));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter(g => g.id !== id)
    }));
  }, []);

  // FIX #6: Include `data` in deps so closure isn't stale
  const calculateBalance = useCallback((childId: string): number => {
    return data.transactions
      .filter(t => t.childId === childId)
      .reduce((balance, transaction) => {
        return transaction.type === 'income'
          ? balance + transaction.amount
          : balance - transaction.amount;
      }, 0);
  }, [data.transactions]);

  const getTransactions = useCallback((childId: string): Transaction[] => {
    return data.transactions
      .filter(t => t.childId === childId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.transactions]);

  // FIX #4: Sort comparator correctly compares a to b
  const getSavingsGoals = useCallback((childId: string): SavingsGoal[] => {
    return data.savingsGoals
      .filter(g => g.childId === childId)
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  }, [data.savingsGoals]);

  const exportData = useCallback((): string => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  // FIX #3: Validate imported data shape before accepting it
  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsed: unknown = JSON.parse(jsonData);
      if (!isValidAppDataShape(parsed)) {
        console.error('Import error: invalid data structure');
        return false;
      }
      setData(parsed);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }, []);

  // FIX #1: Memoize the entire context value so consumers only re-render
  // when something actually changes.
  const value = useMemo<AppContextType>(() => ({
    data,
    selectedChildId,
    setSelectedChildId,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateBalance,
    getTransactions,
    getSavingsGoals,
    exportData,
    importData
  }), [
    data,
    selectedChildId,
    setSelectedChildId,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateBalance,
    getTransactions,
    getSavingsGoals,
    exportData,
    importData
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
