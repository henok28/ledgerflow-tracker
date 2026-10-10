import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseCategory } from '../../types';

export interface ExpensesState {
  items: Expense[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  loading: false,
  actionLoading: false,
  error: null,
};

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Fetch
    fetchExpensesRequest: (
      state,
      _action: PayloadAction<{ category?: string; startDate?: string; endDate?: string } | undefined>
    ) => {
      state.loading = true;
      state.error = null;
    },
    fetchExpensesSuccess: (state, action: PayloadAction<Expense[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchExpensesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createExpenseRequest: (
      state,
      _action: PayloadAction<{
        amount: number;
        category: ExpenseCategory;
        description?: string | null;
        date: string;
      }>
    ) => {
      state.actionLoading = true;
      state.error = null;
    },
    createExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      state.actionLoading = false;
      state.items.unshift(action.payload);
      state.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    createExpenseFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Update
    updateExpenseRequest: (
      state,
      _action: PayloadAction<{
        id: string;
        data: {
          amount: number;
          category: ExpenseCategory;
          description?: string | null;
          date: string;
        };
      }>
    ) => {
      state.actionLoading = true;
      state.error = null;
    },
    updateExpenseSuccess: (state, action: PayloadAction<Expense>) => {
      state.actionLoading = false;
      const index = state.items.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    },
    updateExpenseFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Delete
    deleteExpenseRequest: (state, _action: PayloadAction<string>) => {
      state.actionLoading = true;
      state.error = null;
    },
    deleteExpenseSuccess: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    deleteExpenseFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchExpensesRequest,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  createExpenseRequest,
  createExpenseSuccess,
  createExpenseFailure,
  updateExpenseRequest,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpenseRequest,
  deleteExpenseSuccess,
  deleteExpenseFailure,
} = expensesSlice.actions;

export default expensesSlice.reducer;
