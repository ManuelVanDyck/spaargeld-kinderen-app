import React from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, Award } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

const QuickStats: React.FC = () => {
  const { selectedChildTransactions, selectedChildSavingsGoals } = useAppData();

  // Calculate this month's stats
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const thisMonthTransactions = selectedChildTransactions.filter(t => 
    new Date(t.date) >= currentMonth
  );

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedGoals = selectedChildSavingsGoals.filter(g => g.completed).length;

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  const stats = [
    {
      icon: ArrowUpRight,
      label: 'Deze maand binnen',
      value: formatCurrency(thisMonthIncome),
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: ArrowDownRight, 
      label: 'Deze maand uitgegeven',
      value: formatCurrency(thisMonthExpenses),
      color: 'text-red-600 bg-red-50'
    },
    {
      icon: Calendar,
      label: 'Transacties deze maand',
      value: thisMonthTransactions.length.toString(),
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Award,
      label: 'Behaalde doelen',
      value: completedGoals.toString(),
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="sg-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
