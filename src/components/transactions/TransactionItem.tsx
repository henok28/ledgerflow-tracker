import React from 'react';
import { useAppDispatch } from '../../store';
import {
  openEditExpenseModal,
  openEditIncomeModal,
  openDeleteModal,
} from '../../store/slices/uiSlice';
import { Transaction } from '../../types';
import { formatCurrency, formatDate, formatRelativeDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, Pencil, Trash2 } from 'lucide-react';

interface TransactionItemProps {
  item: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const isIncome = item.type === 'income';

  const handleEdit = () => {
    if (isIncome) {
      dispatch(openEditIncomeModal(item));
    } else {
      dispatch(openEditExpenseModal(item));
    }
  };

  const handleDelete = () => {
    dispatch(
      openDeleteModal({
        type: item.type,
        id: item.id,
        title: isIncome ? item.channel : item.category,
        amount: item.amount,
      })
    );
  };

  // Badge styles based on category/channel
  const getBadgeStyle = () => {
    if (isIncome) {
      switch (item.channel) {
        case 'Instagram':
          return 'bg-pink-50 text-pink-700 border-pink-200';
        case 'TikTok':
          return 'bg-slate-100 text-slate-800 border-slate-300';
        case 'Telegram':
          return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'Facebook':
          return 'bg-blue-50 text-blue-700 border-blue-200';
        default:
          return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      }
    } else {
      switch (item.category) {
        case 'Product Cost':
          return 'bg-amber-50 text-amber-900 border-amber-200';
        case 'Social Media':
          return 'bg-purple-50 text-purple-800 border-purple-200';
        case 'Rent':
          return 'bg-stone-100 text-stone-800 border-stone-300';
        case 'Delivery':
          return 'bg-orange-50 text-orange-800 border-orange-200';
        case 'Salary':
          return 'bg-yellow-50 text-yellow-900 border-yellow-200';
        default:
          return 'bg-expense-bg text-expense-dark border-expense-border';
      }
    }
  };

  const label = isIncome ? item.channel : item.category;

  return (
    <>
      {/* Mobile Card Layout (< md) */}
      <div className="md:hidden bg-white p-4 rounded-xl border border-app-border shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isIncome
                  ? 'bg-income-bg text-income border border-income-border/60'
                  : 'bg-expense-bg text-expense border border-expense-border/60'
              }`}
            >
              {isIncome ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownLeft className="w-4 h-4" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle()}`}
                >
                  {label}
                </span>
                <span className="text-[11px] font-medium text-app-muted">
                  {formatRelativeDate(item.date)}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-app-text font-medium mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <span
              className={`text-base font-extrabold tracking-tight ${
                isIncome ? 'text-income' : 'text-expense'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(item.amount)}
            </span>
          </div>
        </div>

        {/* Bottom Actions for Mobile */}
        <div className="flex items-center justify-between pt-2 border-t border-app-border/60 text-xs">
          <span className="text-[11px] text-app-muted">
            {formatDate(item.date)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="p-1.5 text-app-muted hover:text-forest hover:bg-forest/10 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-app-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table Row (>= md) */}
      <tr className="hidden md:table-row hover:bg-app-bg/60 transition-colors border-b border-app-border/70 last:border-b-0 group">
        {/* Date */}
        <td className="py-3.5 px-4 text-xs font-medium text-app-muted whitespace-nowrap">
          {formatDate(item.date)}
        </td>

        {/* Type & Channel/Category */}
        <td className="py-3.5 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isIncome
                  ? 'bg-income-bg text-income'
                  : 'bg-expense-bg text-expense'
              }`}
            >
              {isIncome ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownLeft className="w-3.5 h-3.5" />
              )}
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle()}`}
            >
              {label}
            </span>
          </div>
        </td>

        {/* Description */}
        <td className="py-3.5 px-4 text-xs text-app-text font-normal max-w-xs truncate">
          {item.description ? (
            <span>{item.description}</span>
          ) : (
            <span className="text-gray-300 italic">No notes</span>
          )}
        </td>

        {/* Amount */}
        <td className="py-3.5 px-4 text-right whitespace-nowrap">
          <span
            className={`text-sm font-bold tracking-tight ${
              isIncome ? 'text-income' : 'text-expense'
            }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(item.amount)}
          </span>
        </td>

        {/* Actions */}
        <td className="py-3.5 px-4 text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-1.5 text-app-muted hover:text-forest hover:bg-forest/10 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-app-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};
