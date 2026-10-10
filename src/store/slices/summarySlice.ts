import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SummaryData } from '../../types';

export interface SummaryState {
  data: SummaryData;
  loading: boolean;
  error: string | null;
}

const initialState: SummaryState = {
  data: {
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    incomeCount: 0,
    expenseCount: 0,
    filter: {},
  },
  loading: false,
  error: null,
};

export const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    fetchSummaryRequest: (
      state,
      _action: PayloadAction<{ startDate?: string; endDate?: string } | undefined>
    ) => {
      state.loading = true;
      state.error = null;
    },
    fetchSummarySuccess: (state, action: PayloadAction<SummaryData>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchSummaryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
} = summarySlice.actions;

export default summarySlice.reducer;
