import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppData, Transaction, SavingsGoal } from '../types';
import { loadAppData, saveAppData, defaultAppData } from '../utils/storage';

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

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [selectedChildId, setSelectedChildId] = useState<string>('otis');

  // Load data on mount
  useEffect(() => {
    const loadedData = loadAppData();
    setData(loadedData);

    // Set first child as selected if available
    if (loadedData.children.length > 0) {
      setSelectedChildId(loadedData.children[0].id);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };

    setData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  };

  const deleteTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: generateId(),
    };

    setData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal]
    }));
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(g =>
        g.id === id ? { ...g, ...updates } : g
      )
    }));
  };

  const deleteSavingsGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter(g => g.id !== id)
    }));
  };

  const calculateBalance = (childId: string): number => {
    return data.transactions
      .filter(t => t.childId === childId)
      .reduce((balance, transaction) => {
        return transaction.type === 'income'
          ? balance + transaction.amount
          : balance - transaction.amount;
      }, 0);
  };

  const getTransactions = (childId: string): Transaction[] => {
    return data.transactions
      .filter(t => t.childId === childId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getSavingsGoals = (childId: string): SavingsGoal[] => {
    return data.savingsGoals
      .filter(g => g.childId === childId)
      .sort((a, _b) => a.completed ? 1 : -1);
  };

  const exportData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData) as AppData;
      setData(parsed);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
};
