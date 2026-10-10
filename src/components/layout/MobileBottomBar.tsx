import React from 'react';
import { useAppDispatch } from '../../store';
import { openAddExpenseModal, openAddIncomeModal } from '../../store/slices/uiSlice';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-app-border p-3 shadow-modal safe-area-pb">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          onClick={() => dispatch(openAddExpenseModal())}
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-expense text-white font-bold text-sm shadow-sm active:scale-95 transition-transform"
        >
          <ArrowDownLeft className="w-4 h-4 text-orange-200" />
          <span>Add Expense</span>
        </button>

        <button
          onClick={() => dispatch(openAddIncomeModal())}
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest text-white font-bold text-sm shadow-sm active:scale-95 transition-transform"
        >
          <ArrowUpRight className="w-4 h-4 text-emerald-300" />
          <span>Add Income</span>
        </button>
      </div>
    </div>
  );
};
