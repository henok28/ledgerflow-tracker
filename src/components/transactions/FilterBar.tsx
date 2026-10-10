import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setTypeFilter,
  setCategoryFilter,
  setChannelFilter,
  setDatePreset,
  setCustomDateRange,
  setSearchQuery,
  resetFilters,
} from '../../store/slices/uiSlice';
import {
  EXPENSE_CATEGORIES,
  INCOME_CHANNELS,
  DatePreset,
  TypeFilter,
} from '../../types';
import { Search, Filter, RotateCcw, Calendar } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.filter);

  const datePresets: { id: DatePreset; label: string }[] = [
    { id: 'THIS_MONTH', label: 'This Month' },
    { id: 'LAST_30_DAYS', label: '30 Days' },
    { id: 'TODAY', label: 'Today' },
    { id: 'ALL_TIME', label: 'All Time' },
    { id: 'CUSTOM', label: 'Custom' },
  ];

  const typeOptions: { id: TypeFilter; label: string }[] = [
    { id: 'ALL', label: 'All Entries' },
    { id: 'INCOME', label: 'Income Only' },
    { id: 'EXPENSE', label: 'Expenses Only' },
  ];

  const isFiltered =
    filter.type !== 'ALL' ||
    filter.category !== 'ALL' ||
    filter.channel !== 'ALL' ||
    filter.datePreset !== 'THIS_MONTH' ||
    Boolean(filter.searchQuery);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-app-border shadow-card mb-6 space-y-4">
      {/* Top Row: Type Pills & Date Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-app-border/70">
        {/* Type Filter Buttons */}
        <div className="inline-flex p-1 bg-app-bg rounded-xl border border-app-border/80 self-start sm:self-auto">
          {typeOptions.map((opt) => {
            const isActive = filter.type === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => dispatch(setTypeFilter(opt.id))}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-forest shadow-sm'
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Date Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {datePresets.map((preset) => {
            const isActive = filter.datePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => dispatch(setDatePreset(preset.id))}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-app-bg text-app-muted hover:text-app-text hover:bg-gray-100 border border-app-border/60'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date Pickers (Shown only when 'CUSTOM' preset is selected) */}
      {filter.datePreset === 'CUSTOM' && (
        <div className="p-3 bg-app-bg rounded-xl border border-app-border/80 flex flex-wrap items-center gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-app-muted uppercase">From:</span>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) =>
                dispatch(
                  setCustomDateRange({
                    startDate: e.target.value,
                    endDate: filter.endDate,
                  })
                )
              }
              className="px-2.5 py-1.5 bg-white border border-app-border rounded-lg text-xs font-medium text-app-text"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-app-muted uppercase">To:</span>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) =>
                dispatch(
                  setCustomDateRange({
                    startDate: filter.startDate,
                    endDate: e.target.value,
                  })
                )
              }
              className="px-2.5 py-1.5 bg-white border border-app-border rounded-lg text-xs font-medium text-app-text"
            />
          </div>
        </div>
      )}

      {/* Bottom Row: Search, Category/Channel Dropdown, and Clear */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search description (e.g. hair, rent, delivery)..."
            value={filter.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-app-border bg-app-bg/50 focus:bg-white focus:border-forest focus:outline-none transition-all"
          />
        </div>

        {/* Dynamic Category / Channel Filter */}
        <div className="sm:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-app-muted">
            <Filter className="w-3.5 h-3.5" />
          </div>

          {filter.type === 'EXPENSE' ? (
            <select
              value={filter.category}
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-app-border bg-app-bg/50 focus:bg-white focus:border-forest focus:outline-none transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="ALL">All Expense Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : filter.type === 'INCOME' ? (
            <select
              value={filter.channel}
              onChange={(e) => dispatch(setChannelFilter(e.target.value))}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-app-border bg-app-bg/50 focus:bg-white focus:border-forest focus:outline-none transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="ALL">All Sales Channels</option>
              {INCOME_CHANNELS.map((chan) => (
                <option key={chan} value={chan}>
                  {chan}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={filter.category}
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-app-border bg-app-bg/50 focus:bg-white focus:border-forest focus:outline-none transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="ALL">All Categories & Channels</option>
              <optgroup label="Expense Categories">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={`exp-${cat}`} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Income Channels">
                {INCOME_CHANNELS.map((chan) => (
                  <option key={`inc-${chan}`} value={chan}>
                    {chan}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
        </div>

        {/* Reset Filter Button */}
        <div className="sm:col-span-2 flex items-center justify-end">
          {isFiltered ? (
            <button
              onClick={() => dispatch(resetFilters())}
              type="button"
              className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold text-app-muted hover:text-forest hover:bg-forest/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="text-right text-[11px] text-app-muted w-full hidden sm:block">
              Filters Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
