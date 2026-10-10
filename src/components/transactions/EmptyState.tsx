import React from 'react';
import { useAppDispatch } from '../../store';
import { openAddExpenseModal, openAddIncomeModal } from '../../store/slices/uiSlice';
import { Receipt, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isFiltered, onResetFilters }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-12 border border-app-border text-center shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-forest/5 text-forest mx-auto flex items-center justify-center mb-4 border border-forest/15">
        <Receipt className="w-7 h-7 text-forest" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-app-text">
        {isFiltered ? 'No matching transactions' : 'No transactions recorded yet'}
      </h3>

      <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-sm mx-auto leading-relaxed">
        {isFiltered
          ? 'Try adjusting your date range, type, or search term to see more entries.'
          : 'Start keeping track of your shop cash flow by logging your first income sale or business expense.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {isFiltered ? (
          <button
            onClick={onResetFilters}
            type="button"
            className="px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-colors"
          >
            Clear All Filters
          </button>
        ) : (
          <>
            <button
              onClick={() => dispatch(openAddIncomeModal())}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              <span>Log First Sale</span>
            </button>
            <button
              onClick={() => dispatch(openAddExpenseModal())}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-expense text-white text-xs font-semibold hover:bg-expense-dark transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ArrowDownLeft className="w-4 h-4 text-orange-200" />
              <span>Log First Expense</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
