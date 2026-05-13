import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import Modal from './ui/Modal';
import type { Transaction } from '../types';

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
  defaultType?: 'income' | 'expense';
  defaultChildId?: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction,
  defaultType = 'income',
  defaultChildId
}) => {
  const { data, addTransaction, updateTransaction, selectedChildId } = useAppData();
  
  const [formData, setFormData] = useState({
    type: defaultType,
    childId: defaultChildId || selectedChildId,
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  });

  // Derive initial form values from props — no effect needed
  const getInitialFormData = () => {
    if (editingTransaction) {
      return {
        type: editingTransaction.type,
        childId: editingTransaction.childId,
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        category: editingTransaction.category,
        date: editingTransaction.date,
      };
    }
    return {
      type: defaultType,
      childId: defaultChildId || selectedChildId,
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    };
  };

  // Track the "open" state so we can reset when modal re-opens
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true);
    setFormData(getInitialFormData());
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Voer een geldig bedrag in');
      return;
    }

    if (!formData.description.trim()) {
      alert('Voer een beschrijving in');
      return;
    }

    if (!formData.category) {
      alert('Selecteer een categorie');
      return;
    }

    const transactionData = {
      type: formData.type as 'income' | 'expense',
      childId: formData.childId,
      amount: amount,
      description: formData.description.trim(),
      category: formData.category,
      date: formData.date
    };

    if (editingTransaction) {
      // Update existing transaction
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      // Add new transaction
      addTransaction(transactionData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const availableCategories = data.categories[formData.type as 'income' | 'expense'] || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Transactie bewerken' : 'Nieuwe transactie'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleInputChange('type', 'income')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${formData.type === 'income'
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            💰 Inkomsten
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('type', 'expense')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
              ${formData.type === 'expense'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            💸 Uitgaven
          </button>
        </div>

        {/* Child Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kind
          </label>
          <select
            value={formData.childId}
            onChange={(e) => handleInputChange('childId', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent min-h-[44px]"
          >
            {data.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrag (€)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent min-h-[44px]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beschrijving
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={formData.type === 'income' ? 'Bijv. Wekelijks zakgeld' : 'Bijv. Pokemonkaarten'}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent min-h-[44px]"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorie
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent min-h-[44px]"
            required
          >
            <option value="">Selecteer categorie...</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datum
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent min-h-[44px]"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4 safe-area-bottom">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors min-h-[44px] text-base"
          >
            Annuleren
          </button>
          <button
            type="submit"
            className={`
              flex-1 px-4 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 transition-colors min-h-[44px] text-base
              ${formData.type === 'income' 
                ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' 
                : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
              }
            `}
          >
            {editingTransaction ? 'Bijwerken' : 'Toevoegen'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
