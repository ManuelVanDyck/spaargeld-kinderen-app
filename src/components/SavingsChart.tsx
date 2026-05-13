import React from 'react';
import type { TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppData } from '../hooks/useAppData';
import { getMonthlyData, formatCurrency } from '../utils/chartHelpers';

const SavingsChart: React.FC = () => {
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
        label: 'Saldo',
        data: sortedMonths.map(month => monthlyData[month].balance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Spaargeld Verloop',
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => `Saldo: ${formatCurrency(context.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
  };

  if (sortedMonths.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spaargeld Verloop</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Nog geen transacties om weer te geven</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SavingsChart;
