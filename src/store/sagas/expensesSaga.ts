import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { Expense, ExpenseCategory } from '../../types';
import {
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
} from '../slices/expensesSlice';
import { fetchSummaryRequest } from '../slices/summarySlice';
import {
  addToast,
  closeExpenseModal,
  closeDeleteModal,
} from '../slices/uiSlice';

function* handleFetchExpenses(
  action: PayloadAction<{ category?: string; startDate?: string; endDate?: string } | undefined>
): Generator<any, void, any> {
  try {
    const data: Expense[] = yield call(api.getExpenses, action.payload);
    yield put(fetchExpensesSuccess(data));
  } catch (error: any) {
    yield put(fetchExpensesFailure(error.message || 'Failed to fetch expenses'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to load expenses' }));
  }
}

function* handleCreateExpense(
  action: PayloadAction<{
    amount: number;
    category: ExpenseCategory;
    description?: string | null;
    date: string;
  }>
): Generator<any, void, any> {
  try {
    const newExpense: Expense = yield call(api.createExpense, action.payload);
    yield put(createExpenseSuccess(newExpense));
    yield put(closeExpenseModal());
    yield put(addToast({ type: 'success', message: 'Expense logged successfully' }));

    // Synchronize summary
    const state: any = yield select();
    yield put(
      fetchSummaryRequest({
        startDate: state.ui.filter.startDate,
        endDate: state.ui.filter.endDate,
      })
    );
  } catch (error: any) {
    yield put(createExpenseFailure(error.message || 'Failed to create expense'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to create expense' }));
  }
}

function* handleUpdateExpense(
  action: PayloadAction<{
    id: string;
    data: {
      amount: number;
      category: ExpenseCategory;
      description?: string | null;
      date: string;
    };
  }>
): Generator<any, void, any> {
  try {
    const updated: Expense = yield call(
      api.updateExpense,
      action.payload.id,
      action.payload.data
    );
    yield put(updateExpenseSuccess(updated));
    yield put(closeExpenseModal());
    yield put(addToast({ type: 'success', message: 'Expense updated successfully' }));

    const state: any = yield select();
    yield put(
      fetchSummaryRequest({
        startDate: state.ui.filter.startDate,
        endDate: state.ui.filter.endDate,
      })
    );
  } catch (error: any) {
    yield put(updateExpenseFailure(error.message || 'Failed to update expense'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to update expense' }));
  }
}

function* handleDeleteExpense(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    yield call(api.deleteExpense, action.payload);
    yield put(deleteExpenseSuccess(action.payload));
    yield put(closeDeleteModal());
    yield put(addToast({ type: 'info', message: 'Expense record deleted' }));

    const state: any = yield select();
    yield put(
      fetchSummaryRequest({
        startDate: state.ui.filter.startDate,
        endDate: state.ui.filter.endDate,
      })
    );
  } catch (error: any) {
    yield put(deleteExpenseFailure(error.message || 'Failed to delete expense'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to delete expense' }));
  }
}

export function* expensesSaga() {
  yield takeLatest(fetchExpensesRequest.type, handleFetchExpenses);
  yield takeLatest(createExpenseRequest.type, handleCreateExpense);
  yield takeLatest(updateExpenseRequest.type, handleUpdateExpense);
  yield takeLatest(deleteExpenseRequest.type, handleDeleteExpense);
}
