import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertTriangle, Check } from 'lucide-react';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';
import { parseExcelData, convertExcelToJSON } from '../utils/excelImport';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { importData, data } = useApp();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setImportResult(null);

    try {
      // Convert Excel to JSON
      const jsonData = await convertExcelToJSON(file);

      // Parse the JSON data to transactions
      const { transactions } = parseExcelData(jsonData);

      if (transactions.length === 0) {
        throw new Error('Geen transacties gevonden in het bestand');
      }

      // Create new app data with imported transactions
      const newAppData = {
        ...data,
        transactions: [...transactions], // Replace existing with imported
        lastBackup: new Date().toISOString()
      };

      // Use the importData function from context
      const success = importData(JSON.stringify(newAppData));

      if (success) {
        setImportResult(`Succesvol ${transactions.length} transacties geïmporteerd!`);
        setTimeout(() => {
          onClose();
          setImportResult(null);
        }, 2000);
      } else {
        throw new Error('Import mislukt - ongeldig data formaat');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout bij importeren');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setError(null);
      setImportResult(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Excel Data Importeren"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Importeer je bestaande Excel bestand
          </h3>
          <p className="text-sm text-gray-500">
            Upload je "Spaargeld kinderen.xlsx" bestand om alle transacties te importeren
          </p>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">Let op!</p>
              <p className="text-amber-700 mt-1">
                Dit vervangt alle huidige transacties met de data uit jouw Excel bestand.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="hidden"
            id="excel-upload"
          />
          <label
            htmlFor="excel-upload"
            className={`
              cursor-pointer flex flex-col items-center space-y-2
              ${isImporting ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}
            `}
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {isImporting ? 'Bezig met importeren...' : 'Klik om Excel bestand te selecteren'}
            </span>
            <span className="text-xs text-gray-500">
              Ondersteunt .xlsx en .xls bestanden
            </span>
          </label>
        </div>

        {/* Loading State */}
        {isImporting && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Data wordt verwerkt...</span>
          </div>
        )}

        {/* Success Message */}
        {importResult && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-sm text-green-800">{importResult}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-red-800 font-medium">Import mislukt</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            disabled={isImporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Bezig...' : 'Sluiten'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
