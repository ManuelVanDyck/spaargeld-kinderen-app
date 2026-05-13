import React from 'react';
import { useAppData } from '../hooks/useAppData';
import SavingsChart from './SavingsChart';
import SpendingChart from './SpendingChart';
import CategoryChart from './CategoryChart';
import ChildSelector from './ChildSelector';

const Charts: React.FC = () => {
  const { selectedChildBalance, selectedChildTransactions } = useAppData();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Statistieken en Grafieken
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Visualisatie van spaar- en uitgavenpatronen
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex-shrink-0">
          <ChildSelector />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Totaal Saldo</div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            €{selectedChildBalance.toFixed(2)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Transacties</div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {selectedChildTransactions.length}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 col-span-2 sm:col-span-1">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Gemiddelde Transactie</div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            €{selectedChildTransactions.length > 0
              ? (selectedChildTransactions.reduce((sum, t) => sum + t.amount, 0) / selectedChildTransactions.length).toFixed(2)
              : '0.00'
            }
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <SavingsChart />
        </div>

        <div>
          <SpendingChart />
        </div>

        <div>
          <CategoryChart />
        </div>
      </div>
    </div>
  );
};

export default Charts;
