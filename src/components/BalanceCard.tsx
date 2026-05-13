import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { useModal } from '../hooks/useModal';
import TransactionModal from './TransactionModal';

const BalanceCard: React.FC = () => {
  const { selectedChild, selectedChildBalance, selectedChildSavingsGoals } = useAppData();
  const incomeModal = useModal();
  const expenseModal = useModal();

  const activeGoalsCount = selectedChildSavingsGoals.filter(g => !g.completed).length;
  const totalGoalTarget = selectedChildSavingsGoals
    .filter(g => !g.completed)
    .reduce((sum, g) => sum + g.targetAmount, 0);

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Saldo van {selectedChild?.name}
        </h2>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: selectedChild?.profileColor }}
        />
      </div>

      {/* Main balance */}
      <div className="mb-5">
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(selectedChildBalance)}
        </div>
        <div className="text-sm text-gray-500">
          Huidige spaargeld
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={incomeModal.open}
          className="flex flex-col items-center p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors min-h-[44px] touch-active"
        >
          <TrendingUp className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Toevoegen</span>
        </button>

        <button
          onClick={expenseModal.open}
          className="flex flex-col items-center p-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors min-h-[44px] touch-active"
        >
          <TrendingDown className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Uitgeven</span>
        </button>

        <button className="flex flex-col items-center p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors min-h-[44px] touch-active">
          <Target className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Doelen</span>
        </button>
      </div>

      {/* Savings goals summary */}
      {activeGoalsCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">{activeGoalsCount}</span> actieve spaardoel{activeGoalsCount !== 1 ? 'en' : ''}
          </div>
          <div className="text-xs text-gray-500">
            Totaal doel: {formatCurrency(totalGoalTarget)}
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={incomeModal.isOpen}
        onClose={incomeModal.close}
        defaultType="income"
        defaultChildId={selectedChild?.id}
      />

      <TransactionModal
        isOpen={expenseModal.isOpen}
        onClose={expenseModal.close}
        defaultType="expense"
        defaultChildId={selectedChild?.id}
      />
    </div>
  );
};

export default BalanceCard;
