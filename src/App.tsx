import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import Charts from './components/Charts';
import InstallBanner from './components/InstallBanner';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'transactions' | 'charts'>('dashboard');

  useEffect(() => {
    // Simple hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'transactions') {
        setCurrentView('transactions');
      } else if (hash === 'charts') {
        setCurrentView('charts');
      } else {
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <Layout>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'transactions' && <TransactionsList />}
        {currentView === 'charts' && <Charts />}
      </Layout>
      <InstallBanner />
    </>
  );
}

export default App;
