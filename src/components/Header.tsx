import React, { useState } from 'react';
import { Wallet, Settings, Download, Upload, LayoutDashboard, List, BarChart3, Menu, X } from 'lucide-react';
import ChildSelector from './ChildSelector';
import ImportModal from './ImportModal';
import { useAppData } from '../hooks/useAppData';
import { useModal } from '../hooks/useModal';

const Header: React.FC = () => {
  const { exportData } = useAppData();
  const importModal = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo and title */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-savings-500 rounded-lg">
                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-bold text-gray-900 leading-tight">Spaargeld</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Beheer het spaargeld van de kinderen</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              <a
                href="#dashboard"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              <a
                href="#transactions"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                <List className="w-4 h-4" />
                <span>Transacties</span>
              </a>
              <a
                href="#charts"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistieken</span>
              </a>
            </nav>

            {/* Desktop Child selector */}
            <div className="hidden md:block">
              <ChildSelector />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={importModal.open}
                className="flex items-center space-x-2 sg-btn-secondary text-sm min-h-[44px]"
                title="Importeer Excel data"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center space-x-2 sg-btn-secondary text-sm min-h-[44px]"
                title="Export data"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-md text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            {/* Mobile Navigation */}
            <nav className="container mx-auto px-4 py-2 space-y-1">
              <a
                href="#dashboard"
                onClick={handleNavClick}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a
                href="#transactions"
                onClick={handleNavClick}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                <List className="w-5 h-5" />
                <span>Transacties</span>
              </a>
              <a
                href="#charts"
                onClick={handleNavClick}
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Statistieken</span>
              </a>
            </nav>

            {/* Mobile Child Selector */}
            <div className="container mx-auto px-4 py-3 border-t border-gray-100">
              <ChildSelector />
            </div>

            {/* Mobile Actions */}
            <div className="container mx-auto px-4 py-3 border-t border-gray-100 flex items-center space-x-2">
              <button
                onClick={() => { importModal.open(); setMobileMenuOpen(false); }}
                className="flex items-center space-x-2 sg-btn-secondary text-sm flex-1 justify-center min-h-[44px]"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>

              <button
                onClick={() => { handleExport(); setMobileMenuOpen(false); }}
                className="flex items-center space-x-2 sg-btn-secondary text-sm flex-1 justify-center min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                className="flex items-center justify-center w-11 h-11 rounded-md text-gray-500 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px]"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      <ImportModal
        isOpen={importModal.isOpen}
        onClose={importModal.close}
      />
    </>
  );
};

export default Header;
