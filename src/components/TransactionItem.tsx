import React from 'react';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../types';
import { useAppData } from '../hooks/useAppData';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  showChild?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  showChild = false
}) => {
  const { deleteTransaction, data } = useAppData();

  const child = data.children.find(c => c.id === transaction.childId);

  const handleDelete = () => {
    if (window.confirm('Weet je zeker dat je deze transactie wilt verwijderen?')) {
      deleteTransaction(transaction.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isIncome = transaction.type === 'income';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow touch-active">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Transaction Type Icon */}
          <div className={`
            p-2 rounded-full flex-shrink-0
            ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
          `}>
            {isIncome ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 gap-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {transaction.description}
              </h3>
              <span className={`
                text-sm font-semibold whitespace-nowrap flex-shrink-0
                ${isIncome ? 'text-green-600' : 'text-red-600'}
              `}>
                {isIncome ? '+' : '-'}€{transaction.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {transaction.category}
              </span>
              {showChild && child && (
                <span style={{ color: child.profileColor }} className="font-medium">
                  {child.name}
                </span>
              )}
              <span>{formatDate(transaction.date)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Bewerken"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Verwijderen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
