import React from 'react';
import { useAppSelector } from '../../store';
import { formatCurrency } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { data, loading } = useAppSelector((state) => state.summary);
  const filter = useAppSelector((state) => state.ui.filter);

  const isNetPositive = data.netProfit >= 0;

  // Active filter label
  const getFilterLabel = () => {
    switch (filter.datePreset) {
      case 'THIS_MONTH':
        return 'This Month';
      case 'LAST_30_DAYS':
        return 'Last 30 Days';
      case 'TODAY':
        return 'Today';
      case 'THIS_YEAR':
        return 'This Year';
      case 'ALL_TIME':
        return 'All Time';
      case 'CUSTOM':
        return filter.startDate && filter.endDate
          ? `${filter.startDate} → ${filter.endDate}`
          : 'Custom Range';
      default:
        return 'Overview';
    }
  };

  if (loading && !data.totalIncome && !data.totalExpense) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-app-border shadow-card animate-pulse space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="w-9 h-9 rounded-xl bg-gray-200"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-100 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Date badge */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
          Financial Summary
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest/10 text-forest border border-forest/20">
          Showing: {getFilterLabel()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Income */}
        <div className="bg-white rounded-2xl p-5 border border-app-border shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-income"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
              Total Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-income-bg text-income flex items-center justify-center border border-income-border/60 group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
              {formatCurrency(data.totalIncome)}
            </p>
            <p className="text-xs text-income font-semibold mt-1 flex items-center gap-1">
              <span>{data.incomeCount} sale{data.incomeCount === 1 ? '' : 's'} recorded</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-app-border shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-expense"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
              Total Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-expense-bg text-expense flex items-center justify-center border border-expense-border/60 group-hover:scale-105 transition-transform">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
              {formatCurrency(data.totalExpense)}
            </p>
            <p className="text-xs text-expense font-semibold mt-1 flex items-center gap-1">
              <span>{data.expenseCount} expense{data.expenseCount === 1 ? '' : 's'} recorded</span>
            </p>
          </div>
        </div>

        {/* Card 3: Net Profit */}
        <div
          className={`bg-white rounded-2xl p-5 border border-app-border shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group ${
            isNetPositive ? 'border-l-4 border-l-income' : 'border-l-4 border-l-expense'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
              Net Profit
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isNetPositive
                  ? 'bg-income-bg text-income border border-income-border/60'
                  : 'bg-expense-bg text-expense border border-expense-border/60'
              }`}
            >
              {isNetPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="mt-2.5">
            <p
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isNetPositive ? 'text-income' : 'text-expense'
              }`}
            >
              {isNetPositive ? '' : '-'}
              {formatCurrency(Math.abs(data.netProfit))}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  isNetPositive
                    ? 'bg-income-bg text-income'
                    : 'bg-expense-bg text-expense'
                }`}
              >
                {isNetPositive ? 'Profitable' : 'Deficit'}
              </span>
              <span className="text-xs text-app-muted">
                {data.totalIncome > 0
                  ? `${Math.round((data.netProfit / data.totalIncome) * 100)}% margin`
                  : 'No sales'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
