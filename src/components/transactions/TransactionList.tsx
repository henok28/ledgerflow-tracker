import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { Transaction } from '../../types';
import { TransactionItem } from './TransactionItem';
import { EmptyState } from './EmptyState';
import { resetFilters } from '../../store/slices/uiSlice';
import { fetchExpensesRequest } from '../../store/slices/expensesSlice';
import { fetchIncomeRequest } from '../../store/slices/incomeSlice';
import { ArrowDownUp, RefreshCw } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses);
  const income = useAppSelector((state) => state.income);
  const filter = useAppSelector((state) => state.ui.filter);

  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const isLoading = expenses.loading || income.loading;
  const hasError = expenses.error || income.error;

  const handleRefresh = () => {
    dispatch(
      fetchExpensesRequest({
        startDate: filter.startDate,
        endDate: filter.endDate,
      })
    );
    dispatch(
      fetchIncomeRequest({
        startDate: filter.startDate,
        endDate: filter.endDate,
      })
    );
  };

  // Combine and filter transactions
  const filteredTransactions = useMemo(() => {
    let combined: Transaction[] = [];

    if (filter.type === 'ALL' || filter.type === 'EXPENSE') {
      const mappedExpenses: Transaction[] = expenses.items.map((e) => ({
        ...e,
        type: 'expense' as const,
      }));
      combined = [...combined, ...mappedExpenses];
    }

    if (filter.type === 'ALL' || filter.type === 'INCOME') {
      const mappedIncome: Transaction[] = income.items.map((i) => ({
        ...i,
        type: 'income' as const,
      }));
      combined = [...combined, ...mappedIncome];
    }

    // Category / Channel Filter
    if (filter.category !== 'ALL') {
      combined = combined.filter((item) => {
        if (item.type === 'expense') return item.category === filter.category;
        if (item.type === 'income') return item.channel === filter.category;
        return true;
      });
    }

    if (filter.channel !== 'ALL') {
      combined = combined.filter((item) => {
        if (item.type === 'income') return item.channel === filter.channel;
        return true;
      });
    }

    // Date Range Filter
    if (filter.startDate) {
      const startTime = new Date(filter.startDate).getTime();
      combined = combined.filter((item) => new Date(item.date).getTime() >= startTime);
    }

    if (filter.endDate) {
      const endDate = new Date(filter.endDate);
      endDate.setHours(23, 59, 59, 999);
      combined = combined.filter((item) => new Date(item.date).getTime() <= endDate.getTime());
    }

    // Search query filter
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      combined = combined.filter((item) => {
        const desc = item.description?.toLowerCase() || '';
        const tag = item.type === 'expense' ? item.category.toLowerCase() : item.channel.toLowerCase();
        return desc.includes(q) || tag.includes(q);
      });
    }

    // Sort order
    return combined.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [expenses.items, income.items, filter, sortOrder]);

  const isFiltered =
    filter.type !== 'ALL' ||
    filter.category !== 'ALL' ||
    filter.channel !== 'ALL' ||
    filter.datePreset !== 'THIS_MONTH' ||
    Boolean(filter.searchQuery);

  return (
    <div className="bg-white rounded-2xl border border-app-border shadow-card overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-app-border/80 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <span>Transaction Ledger</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-app-bg text-app-muted border border-app-border/70">
              {filteredTransactions.length}
            </span>
          </h2>
          <p className="text-xs text-app-muted mt-0.5">
            Combined log of income sales and business costs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-app-border text-xs font-semibold text-app-text hover:bg-app-subtle transition-colors"
            title="Sort order"
          >
            <ArrowDownUp className="w-3.5 h-3.5 text-app-muted" />
            <span className="hidden sm:inline">
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </span>
          </button>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            type="button"
            disabled={isLoading}
            className="p-1.5 rounded-xl border border-app-border text-app-muted hover:text-app-text hover:bg-app-subtle transition-colors disabled:opacity-50"
            title="Refresh transactions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {hasError && (
        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between text-xs text-red-700">
          <span>Failed to sync recent transactions. Showing local cache.</span>
          <button
            onClick={handleRefresh}
            className="font-bold underline hover:no-underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && filteredTransactions.length === 0 ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 bg-gray-100/70 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="p-6">
          <EmptyState
            isFiltered={isFiltered}
            onResetFilters={() => dispatch(resetFilters())}
          />
        </div>
      ) : (
        <>
          {/* Mobile Card List */}
          <div className="md:hidden p-4 space-y-3">
            {filteredTransactions.map((item) => (
              <TransactionItem key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-app-bg/60 border-b border-app-border/80 text-[11px] font-bold text-app-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type & Channel / Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/60">
                {filteredTransactions.map((item) => (
                  <TransactionItem key={`${item.type}-${item.id}`} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
