import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeExpenseModal } from '../../store/slices/uiSlice';
import { createExpenseRequest, updateExpenseRequest } from '../../store/slices/expensesSlice';
import { Modal } from '../common/Modal';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../types';
import { toInputDateFormat } from '../../utils/formatters';
import { Loader2, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

export const ExpenseModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, editingItem } = useAppSelector((state) => state.ui.expenseModal);
  const actionLoading = useAppSelector((state) => state.expenses.actionLoading);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Product Cost');
  const [date, setDate] = useState(toInputDateFormat());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setAmount(editingItem.amount.toString());
      setCategory(editingItem.category);
      setDate(editingItem.date ? toInputDateFormat(new Date(editingItem.date)) : toInputDateFormat());
      setDescription(editingItem.description || '');
      setErrors({});
    } else {
      setAmount('');
      setCategory('Product Cost');
      setDate(toInputDateFormat());
      setDescription('');
      setErrors({});
    }
  }, [editingItem, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const num = parseFloat(amount);
    if (!amount.trim()) {
      errs.amount = 'Amount is required';
    } else if (isNaN(num) || num <= 0) {
      errs.amount = 'Enter a positive amount greater than 0';
    }

    if (!category) {
      errs.category = 'Category is required';
    }

    if (!date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      description: description.trim() || null,
    };

    if (editingItem) {
      dispatch(updateExpenseRequest({ id: editingItem.id, data: payload }));
    } else {
      dispatch(createExpenseRequest(payload));
    }
  };

  const isEditing = Boolean(editingItem);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !actionLoading && dispatch(closeExpenseModal())}
      title={isEditing ? 'Edit Expense Record' : 'Record Business Expense'}
      subtitle={
        isEditing
          ? 'Modify previous business expense entry'
          : 'Log money spent on goods, operations, or inventory'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Amount Spend <span className="text-expense">*</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-expense focus-within:ring-2 focus-within:ring-expense/20 transition-all bg-white overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
              <DollarSign className="w-5 h-5 text-expense" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              autoFocus
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              className="w-full pl-10 pr-4 py-3 text-lg font-bold text-app-text placeholder:text-gray-300 focus:outline-none"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Category <span className="text-expense">*</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-expense focus-within:ring-2 focus-within:ring-expense/20 transition-all bg-white">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
              <Tag className="w-4 h-4 text-app-muted" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-app-text bg-transparent focus:outline-none appearance-none cursor-pointer"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.category}</p>
          )}
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Date of Expense <span className="text-expense">*</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-expense focus-within:ring-2 focus-within:ring-expense/20 transition-all bg-white">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
              <Calendar className="w-4 h-4 text-app-muted" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-app-text bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
          {errors.date && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.date}</p>
          )}
        </div>

        {/* Description / Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Description / Note <span className="text-xs text-app-muted font-normal lowercase">(optional)</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-expense focus-within:ring-2 focus-within:ring-expense/20 transition-all bg-white">
            <div className="absolute top-3 left-3.5 pointer-events-none text-app-muted">
              <FileText className="w-4 h-4 text-app-muted" />
            </div>
            <textarea
              rows={2}
              placeholder="e.g. artificial hair batch #14, delivery fee, rent deposit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-app-text placeholder:text-gray-400 bg-transparent focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => dispatch(closeExpenseModal())}
            className="px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold text-app-text hover:bg-app-subtle transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={actionLoading}
            className="px-5 py-2.5 rounded-xl bg-expense text-white text-sm font-semibold hover:bg-expense-dark transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEditing ? 'Save Changes' : 'Log Expense'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
