import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeIncomeModal } from '../../store/slices/uiSlice';
import { createIncomeRequest, updateIncomeRequest } from '../../store/slices/incomeSlice';
import { Modal } from '../common/Modal';
import { INCOME_CHANNELS, IncomeChannel } from '../../types';
import { toInputDateFormat } from '../../utils/formatters';
import { Loader2, DollarSign, Calendar, Share2, FileText } from 'lucide-react';

export const IncomeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, editingItem } = useAppSelector((state) => state.ui.incomeModal);
  const actionLoading = useAppSelector((state) => state.income.actionLoading);

  const [amount, setAmount] = useState('');
  const [channel, setChannel] = useState<IncomeChannel>('Instagram');
  const [date, setDate] = useState(toInputDateFormat());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setAmount(editingItem.amount.toString());
      setChannel(editingItem.channel);
      setDate(editingItem.date ? toInputDateFormat(new Date(editingItem.date)) : toInputDateFormat());
      setDescription(editingItem.description || '');
      setErrors({});
    } else {
      setAmount('');
      setChannel('Instagram');
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

    if (!channel) {
      errs.channel = 'Sales channel is required';
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
      channel,
      date: new Date(date).toISOString(),
      description: description.trim() || null,
    };

    if (editingItem) {
      dispatch(updateIncomeRequest({ id: editingItem.id, data: payload }));
    } else {
      dispatch(createIncomeRequest(payload));
    }
  };

  const isEditing = Boolean(editingItem);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !actionLoading && dispatch(closeIncomeModal())}
      title={isEditing ? 'Edit Income Entry' : 'Record Business Income'}
      subtitle={
        isEditing
          ? 'Modify previous revenue sale entry'
          : 'Log customer payments, online orders, or product sales'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Amount Earned <span className="text-income">*</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-income focus-within:ring-2 focus-within:ring-income/20 transition-all bg-white overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
              <DollarSign className="w-5 h-5 text-income" />
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

        {/* Channel Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Sales Channel <span className="text-income">*</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-income focus-within:ring-2 focus-within:ring-income/20 transition-all bg-white">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-muted">
              <Share2 className="w-4 h-4 text-app-muted" />
            </div>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as IncomeChannel)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-app-text bg-transparent focus:outline-none appearance-none cursor-pointer"
            >
              {INCOME_CHANNELS.map((chan) => (
                <option key={chan} value={chan}>
                  {chan}
                </option>
              ))}
            </select>
          </div>
          {errors.channel && (
            <p className="text-xs text-red-600 mt-1 font-medium">{errors.channel}</p>
          )}
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-app-text mb-1.5">
            Date of Sale <span className="text-income">*</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-income focus-within:ring-2 focus-within:ring-income/20 transition-all bg-white">
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
            Description / Item Sold <span className="text-xs text-app-muted font-normal lowercase">(optional)</span>
          </label>
          <div className="relative rounded-xl border border-app-border focus-within:border-income focus-within:ring-2 focus-within:ring-income/20 transition-all bg-white">
            <div className="absolute top-3 left-3.5 pointer-events-none text-app-muted">
              <FileText className="w-4 h-4 text-app-muted" />
            </div>
            <textarea
              rows={2}
              placeholder="e.g. sold 1 unit of artificial hair, VIP client bundle..."
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
            onClick={() => dispatch(closeIncomeModal())}
            className="px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold text-app-text hover:bg-app-subtle transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={actionLoading}
            className="px-5 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold hover:bg-forest-light transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isEditing ? 'Save Changes' : 'Log Income'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
