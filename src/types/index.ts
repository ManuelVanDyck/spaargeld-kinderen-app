export interface Child {
  id: string;
  name: string;
  birthDate: string;
  currentBalance: number;
  profileColor: string;
}

export interface Transaction {
  id: string;
  childId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  photoUrl?: string;
}

export interface SavingsGoal {
  id: string;
  childId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  description?: string;
  completed: boolean;
}

export interface AppData {
  children: Child[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  categories: {
    income: string[];
    expense: string[];
  };
  lastBackup: string;
}

export type TransactionType = 'income' | 'expense';
