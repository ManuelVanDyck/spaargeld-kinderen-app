import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const InstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (!success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Download className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">App installeren</p>
              <p className="text-xs text-blue-100">
                Voeg toe aan startscherm voor snelle toegang
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-3">
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Installeer
            </button>
            <button
              onClick={handleDismiss}
              className="text-blue-200 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
