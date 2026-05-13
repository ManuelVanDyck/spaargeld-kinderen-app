import React from 'react';
import { useAppData } from '../hooks/useAppData';

const ChildSelector: React.FC = () => {
  const { data, selectedChildId, setSelectedChildId, calculateBalance } = useAppData();

  return (
    <div className="flex space-x-2 overflow-x-auto max-w-xs">
      {data.children.map((child) => {
        const balance = calculateBalance(child.id);
        const isSelected = selectedChildId === child.id;

        return (
          <button
            key={child.id}
            onClick={() => setSelectedChildId(child.id)}
            className={`
              flex-shrink-0 rounded-lg border-2 p-3 min-w-[120px] text-center transition-all
              ${isSelected
                ? 'border-savings-500 bg-savings-50 text-savings-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }
            `}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: child.profileColor }}
            >
              {child.name.charAt(0)}
            </div>
            <div className="font-medium text-sm">{child.name}</div>
            <div className={`text-xs ${isSelected ? 'text-savings-600' : 'text-gray-500'}`}>
              €{balance.toFixed(2)}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChildSelector;
