import React from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const RecentTransactions: React.FC = () => {
  const { selectedChildTransactions } = useAppData();
  
  const recentTransactions = selectedChildTransactions.slice(0, 5);

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

  if (recentTransactions.length === 0) {
    return (
      <div className="sg-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recente transacties
        </h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Nog geen transacties</p>
          <button className="sg-btn-primary mt-4">
            Eerste transactie toevoegen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recente transacties
        </h3>
        <button className="text-sm text-savings-600 hover:text-savings-700 font-medium">
          Alle weergeven
        </button>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-lg
                ${transaction.type === 'income' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
                }
              `}>
                {transaction.type === 'income' 
                  ? <ArrowUpRight className="w-4 h-4" />
                  : <ArrowDownRight className="w-4 h-4" />
                }
              </div>
              
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {transaction.description}
                </div>
                <div className="text-xs text-gray-500">
                  {transaction.category} • {format(new Date(transaction.date), 'dd MMM yyyy', { locale: nl })}
                </div>
              </div>
            </div>

            <div className={`
              font-semibold text-sm
              ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
            `}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
