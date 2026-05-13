import type { Transaction } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const formatCurrency = (value: number) => `€${value.toFixed(2)}`;

export const getMonthlyData = (transactions: Transaction[]) => {
  const monthlyData: { [key: string]: { income: number; expenses: number; balance: number } } = {};

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0, balance: 0 };
    }

    if (transaction.type === 'income') {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expenses += transaction.amount;
    }
  });

  // Calculate running balance
  let runningBalance = 0;
  const sortedMonths = Object.keys(monthlyData).sort();

  sortedMonths.forEach(month => {
    runningBalance += monthlyData[month].income - monthlyData[month].expenses;
    monthlyData[month].balance = runningBalance;
  });

  return monthlyData;
};

export const getCategoryData = (transactions: Transaction[], type: 'income' | 'expense') => {
  const categoryTotals: { [key: string]: number } = {};

  transactions
    .filter(t => t.type === type)
    .forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

  return categoryTotals;
};

export const getChartColors = (count: number) => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6b7280', // gray
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};
