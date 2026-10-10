import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FilterState,
  Expense,
  Income,
  ToastMessage,
  DeleteConfirmModalState,
  DatePreset,
} from '../../types';
import { getDateRangeForPreset } from '../../utils/formatters';

export interface UiState {
  filter: FilterState;
  expenseModal: {
    isOpen: boolean;
    editingItem: Expense | null;
  };
  incomeModal: {
    isOpen: boolean;
    editingItem: Income | null;
  };
  deleteModal: DeleteConfirmModalState | null;
  toasts: ToastMessage[];
}

const defaultRange = getDateRangeForPreset('THIS_MONTH');

const initialState: UiState = {
  filter: {
    type: 'ALL',
    category: 'ALL',
    channel: 'ALL',
    datePreset: 'THIS_MONTH',
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    searchQuery: '',
  },
  expenseModal: {
    isOpen: false,
    editingItem: null,
  },
  incomeModal: {
    isOpen: false,
    editingItem: null,
  },
  deleteModal: null,
  toasts: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTypeFilter: (state, action: PayloadAction<FilterState['type']>) => {
      state.filter.type = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
    },
    setChannelFilter: (state, action: PayloadAction<string>) => {
      state.filter.channel = action.payload;
    },
    setDatePreset: (state, action: PayloadAction<DatePreset>) => {
      state.filter.datePreset = action.payload;
      if (action.payload !== 'CUSTOM') {
        const range = getDateRangeForPreset(action.payload);
        state.filter.startDate = range.startDate;
        state.filter.endDate = range.endDate;
      }
    },
    setCustomDateRange: (
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) => {
      state.filter.datePreset = 'CUSTOM';
      state.filter.startDate = action.payload.startDate;
      state.filter.endDate = action.payload.endDate;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      const range = getDateRangeForPreset('THIS_MONTH');
      state.filter = {
        type: 'ALL',
        category: 'ALL',
        channel: 'ALL',
        datePreset: 'THIS_MONTH',
        startDate: range.startDate,
        endDate: range.endDate,
        searchQuery: '',
      };
    },

    // Modals
    openAddExpenseModal: (state) => {
      state.expenseModal = { isOpen: true, editingItem: null };
    },
    openEditExpenseModal: (state, action: PayloadAction<Expense>) => {
      state.expenseModal = { isOpen: true, editingItem: action.payload };
    },
    closeExpenseModal: (state) => {
      state.expenseModal = { isOpen: false, editingItem: null };
    },

    openAddIncomeModal: (state) => {
      state.incomeModal = { isOpen: true, editingItem: null };
    },
    openEditIncomeModal: (state, action: PayloadAction<Income>) => {
      state.incomeModal = { isOpen: true, editingItem: action.payload };
    },
    closeIncomeModal: (state) => {
      state.incomeModal = { isOpen: false, editingItem: null };
    },

    openDeleteModal: (
      state,
      action: PayloadAction<{
        type: 'expense' | 'income';
        id: string;
        title: string;
        amount: number;
      }>
    ) => {
      state.deleteModal = {
        isOpen: true,
        ...action.payload,
      };
    },
    closeDeleteModal: (state) => {
      state.deleteModal = null;
    },

    // Toasts
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setTypeFilter,
  setCategoryFilter,
  setChannelFilter,
  setDatePreset,
  setCustomDateRange,
  setSearchQuery,
  resetFilters,
  openAddExpenseModal,
  openEditExpenseModal,
  closeExpenseModal,
  openAddIncomeModal,
  openEditIncomeModal,
  closeIncomeModal,
  openDeleteModal,
  closeDeleteModal,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
