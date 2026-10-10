import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Income, IncomeChannel } from '../../types';

export interface IncomeState {
  items: Income[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  items: [],
  loading: false,
  actionLoading: false,
  error: null,
};

export const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    // Fetch
    fetchIncomeRequest: (
      state,
      _action: PayloadAction<{ channel?: string; startDate?: string; endDate?: string } | undefined>
    ) => {
      state.loading = true;
      state.error = null;
    },
    fetchIncomeSuccess: (state, action: PayloadAction<Income[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchIncomeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createIncomeRequest: (
      state,
      _action: PayloadAction<{
        amount: number;
        channel: IncomeChannel;
        description?: string | null;
        date: string;
      }>
    ) => {
      state.actionLoading = true;
      state.error = null;
    },
    createIncomeSuccess: (state, action: PayloadAction<Income>) => {
      state.actionLoading = false;
      state.items.unshift(action.payload);
      state.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    createIncomeFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Update
    updateIncomeRequest: (
      state,
      _action: PayloadAction<{
        id: string;
        data: {
          amount: number;
          channel: IncomeChannel;
          description?: string | null;
          date: string;
        };
      }>
    ) => {
      state.actionLoading = true;
      state.error = null;
    },
    updateIncomeSuccess: (state, action: PayloadAction<Income>) => {
      state.actionLoading = false;
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    },
    updateIncomeFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },

    // Delete
    deleteIncomeRequest: (state, _action: PayloadAction<string>) => {
      state.actionLoading = true;
      state.error = null;
    },
    deleteIncomeSuccess: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    deleteIncomeFailure: (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchIncomeRequest,
  fetchIncomeSuccess,
  fetchIncomeFailure,
  createIncomeRequest,
  createIncomeSuccess,
  createIncomeFailure,
  updateIncomeRequest,
  updateIncomeSuccess,
  updateIncomeFailure,
  deleteIncomeRequest,
  deleteIncomeSuccess,
  deleteIncomeFailure,
} = incomeSlice.actions;

export default incomeSlice.reducer;
