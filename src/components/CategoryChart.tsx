import React, { useState } from 'react';
import type { TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAppData } from '../hooks/useAppData';
import { getCategoryData, formatCurrency, getChartColors } from '../utils/chartHelpers';

const CategoryChart: React.FC = () => {
  const { selectedChildTransactions } = useAppData();
  const [chartType, setChartType] = useState<'income' | 'expense'>('expense');

  const categoryData = getCategoryData(selectedChildTransactions, chartType);
  const categories = Object.keys(categoryData);
  const values = Object.values(categoryData);
  const total = values.reduce((sum, value) => sum + value, 0);

  const data = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: getChartColors(categories.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  const toggleButtons = (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setChartType('income')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          chartType === 'income'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Inkomsten
      </button>
      <button
        onClick={() => setChartType('expense')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          chartType === 'expense'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Uitgaven
      </button>
    </div>
  );

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {chartType === 'income' ? 'Inkomsten' : 'Uitgaven'} per Categorie
          </h3>
          {toggleButtons}
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Geen {chartType === 'income' ? 'inkomsten' : 'uitgaven'} om weer te geven</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {chartType === 'income' ? 'Inkomsten' : 'Uitgaven'} per Categorie
        </h3>
        {toggleButtons}
      </div>

      <div className="relative">
        <div className="h-64">
          <Doughnut data={data} options={options} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
            <p className="text-sm text-gray-500">Totaal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryChart;
