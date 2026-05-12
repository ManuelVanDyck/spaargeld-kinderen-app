import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const useAppData = () => {
  const app = useApp();

  const selectedChild = useMemo(() => {
    return app.data.children.find(c => c.id === app.selectedChildId) || app.data.children[0];
  }, [app.data.children, app.selectedChildId]);

  const selectedChildBalance = useMemo(() => {
    return app.calculateBalance(app.selectedChildId);
  }, [app.selectedChildId, app.data.transactions]);

  const selectedChildTransactions = useMemo(() => {
    return app.getTransactions(app.selectedChildId);
  }, [app.selectedChildId, app.data.transactions]);

  const selectedChildSavingsGoals = useMemo(() => {
    return app.getSavingsGoals(app.selectedChildId);
  }, [app.selectedChildId, app.data.savingsGoals]);

  return {
    ...app,
    selectedChild,
    selectedChildBalance,
    selectedChildTransactions,
    selectedChildSavingsGoals
  };
};
