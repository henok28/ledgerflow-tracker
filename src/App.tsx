import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { fetchExpensesRequest } from './store/slices/expensesSlice';
import { fetchIncomeRequest } from './store/slices/incomeSlice';
import { fetchSummaryRequest } from './store/slices/summarySlice';
import { Header } from './components/layout/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { FilterBar } from './components/transactions/FilterBar';
import { TransactionList } from './components/transactions/TransactionList';
import { ExpenseModal } from './components/forms/ExpenseModal';
import { IncomeModal } from './components/forms/IncomeModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { ToastContainer } from './components/common/ToastContainer';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.filter);

  // Load initial data and react to date range filter updates
  useEffect(() => {
    const params = {
      startDate: filter.startDate || undefined,
      endDate: filter.endDate || undefined,
    };

    dispatch(fetchExpensesRequest(params));
    dispatch(fetchIncomeRequest(params));
    dispatch(fetchSummaryRequest(params));
  }, [dispatch, filter.startDate, filter.endDate]);

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans pb-20 sm:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <SummaryCards />
        <FilterBar />
        <TransactionList />
      </main>

      <Footer />

      {/* Floating & Modals */}
      <MobileBottomBar />
      <ExpenseModal />
      <IncomeModal />
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
};

export default App;
