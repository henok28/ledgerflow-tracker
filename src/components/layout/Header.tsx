import React from 'react';
import { useAppDispatch } from '../../store';
import { openAddExpenseModal, openAddIncomeModal } from '../../store/slices/uiSlice';
import { Plus, ArrowDownLeft, ArrowUpRight, Store } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="bg-forest text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Shop Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-light/60 border border-white/20 flex items-center justify-center shadow-inner">
              <Store className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  LedgerFlow
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Shop Tracker
                </span>
              </div>
              <p className="text-xs text-white/70 tracking-normal hidden xs:block">
                Manual Expense & Income Manager
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => dispatch(openAddExpenseModal())}
              type="button"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-expense/90 hover:bg-expense text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4 text-orange-200" />
              <span>Log Expense</span>
            </button>

            <button
              onClick={() => dispatch(openAddIncomeModal())}
              type="button"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-200" />
              <span>Log Income</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
