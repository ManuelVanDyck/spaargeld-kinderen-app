import React from 'react';
import { Wallet, Settings, Download } from 'lucide-react';
import ChildSelector from './ChildSelector';
import { useAppData } from '../hooks/useAppData';

const Header: React.FC = () => {
  const { exportData } = useAppData();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spaargeld-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-savings-500 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Spaargeld Kinderen</h1>
              <p className="text-sm text-gray-500">Beheer het spaargeld van de kinderen</p>
            </div>
          </div>

          {/* Child selector - desktop */}
          <div className="hidden md:block">
            <ChildSelector />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 sg-btn-secondary text-sm"
              title="Export data"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Child selector - mobile */}
        <div className="md:hidden pb-4">
          <ChildSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
