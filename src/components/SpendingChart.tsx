import React from 'react';
import type { TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppData } from '../hooks/useAppData';
import { getMonthlyData, formatCurrency } from '../utils/chartHelpers';

const SpendingChart: React.FC = () => {
  const { selectedChildTransactions } = useAppData();

  const monthlyData = getMonthlyData(selectedChildTransactions);
  const sortedMonths = Object.keys(monthlyData).sort();

  const data = {
    labels: sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Inkomsten',
        data: sortedMonths.map(month => monthlyData[month].income),
        backgroundColor: '#10b981',
        borderRadius: 4,
        maxBarThickness: 40,
      },
      {
        label: 'Uitgaven',
        data: sortedMonths.map(month => monthlyData[month].expenses),
        backgroundColor: '#ef4444',
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Maandelijkse Inkomsten vs Uitgaven',
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => `${context.dataset.label}: ${formatCurrency(context.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: false,
        ticks: {
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  if (sortedMonths.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maandelijkse Inkomsten vs Uitgaven</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Nog geen transacties om weer te geven</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SpendingChart;
