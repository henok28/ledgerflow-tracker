import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeDeleteModal } from '../../store/slices/uiSlice';
import { deleteExpenseRequest } from '../../store/slices/expensesSlice';
import { deleteIncomeRequest } from '../../store/slices/incomeSlice';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ConfirmDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const deleteModal = useAppSelector((state) => state.ui.deleteModal);
  const expenseActionLoading = useAppSelector((state) => state.expenses.actionLoading);
  const incomeActionLoading = useAppSelector((state) => state.income.actionLoading);

  const isDeleting = expenseActionLoading || incomeActionLoading;

  if (!deleteModal || !deleteModal.isOpen) return null;

  const handleConfirm = () => {
    if (deleteModal.type === 'expense') {
      dispatch(deleteExpenseRequest(deleteModal.id));
    } else {
      dispatch(deleteIncomeRequest(deleteModal.id));
    }
  };

  const isExpense = deleteModal.type === 'expense';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={() => !isDeleting && dispatch(closeDeleteModal())}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal p-6 z-10 animate-fade-in border border-app-border">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-app-text">
              Delete {isExpense ? 'Expense' : 'Income'} Record?
            </h3>
            <p className="text-sm text-app-muted mt-1 leading-relaxed">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>

            <div className="mt-3.5 p-3 rounded-xl bg-app-bg border border-app-border/80 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-app-muted">
                  {deleteModal.title || (isExpense ? 'Expense' : 'Income')}
                </span>
                <p className="text-xs text-app-muted mt-0.5">
                  ID: {deleteModal.id.substring(0, 8)}...
                </p>
              </div>
              <span
                className={`text-base font-bold ${
                  isExpense ? 'text-expense' : 'text-income'
                }`}
              >
                {isExpense ? '-' : '+'}
                {formatCurrency(deleteModal.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => dispatch(closeDeleteModal())}
            className="px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold text-app-text hover:bg-app-subtle transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isDeleting ? 'Deleting...' : 'Delete Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
