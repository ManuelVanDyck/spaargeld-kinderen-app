import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import TransactionItem from './TransactionItem';
import TransactionFilters, { type FilterState } from './TransactionFilters';
import TransactionModal from './TransactionModal';
import { useModal } from '../hooks/useModal';
import { useAppData } from '../hooks/useAppData';
import type { Transaction } from '../types';

const TransactionsList: React.FC = () => {
  const { data } = useAppData();
  const transactionModal = useModal();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    childId: '',
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = [...data.transactions];

    // Apply filters
    if (filters.childId) {
      result = result.filter(t => t.childId === filters.childId);
    }

    if (filters.type) {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.dateFrom) {
      result = result.filter(t => t.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter(t => t.date <= filters.dateTo);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [data.transactions, filters]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    transactionModal.open();
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    transactionModal.open();
  };

  const handleModalClose = () => {
    setEditingTransaction(null);
    transactionModal.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Alle Transacties
        </h1>

        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 bg-savings-500 text-white px-3 sm:px-4 py-2.5 rounded-lg hover:bg-savings-600 transition-colors min-h-[44px] text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nieuwe transactie</span>
          <span className="sm:hidden">Nieuw</span>
        </button>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFilterChange={setFilters}
        transactionCount={filteredTransactions.length}
      />

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {data.transactions.length === 0
                ? 'Nog geen transacties toegevoegd'
                : 'Geen transacties gevonden met de huidige filters'
              }
            </p>
            <button
              onClick={handleAddNew}
              className="text-savings-600 hover:text-savings-700 underline"
            >
              Voeg je eerste transactie toe
            </button>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              showChild={!filters.childId}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      <TransactionModal
        isOpen={transactionModal.isOpen}
        onClose={handleModalClose}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default TransactionsList;
