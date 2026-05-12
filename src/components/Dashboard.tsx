import React from 'react';
import BalanceCard from './BalanceCard';
import QuickStats from './QuickStats';
import RecentTransactions from './RecentTransactions';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top row - Balance and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BalanceCard />
        </div>
        <div className="lg:col-span-2">
          <QuickStats />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
