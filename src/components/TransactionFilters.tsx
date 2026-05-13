import React from 'react';
import { Filter, SortDesc } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

export interface FilterState {
  childId: string;
  type: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  transactionCount: number;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFilterChange,
  transactionCount
}) => {
  const { data } = useAppData();

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      childId: '',
      type: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const allCategories = [...new Set([
    ...data.categories.income,
    ...data.categories.expense
  ])];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">
            Filters ({transactionCount} transacties)
          </h3>
        </div>

        <button
          onClick={clearFilters}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Filters wissen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Child Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Kind
          </label>
          <select
            value={filters.childId}
            onChange={(e) => handleFilterChange('childId', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent"
          >
            <option value="">Alle kinderen</option>
            {data.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent"
          >
            <option value="">Alle types</option>
            <option value="income">Inkomsten</option>
            <option value="expense">Uitgaven</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Categorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent"
          >
            <option value="">Alle categorieën</option>
            {allCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Sorteren
          </label>
          <div className="flex space-x-0">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent"
            >
              <option value="date">Datum</option>
              <option value="amount">Bedrag</option>
            </select>
            <button
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`
                px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm
                ${filters.sortOrder === 'desc' ? 'bg-gray-50 text-gray-700' : 'bg-white text-gray-500'}
                hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-savings-500
              `}
              title={filters.sortOrder === 'desc' ? 'Aflopend' : 'Oplopend'}
            >
              <SortDesc className={`w-4 h-4 ${filters.sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Van datum
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tot datum
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
