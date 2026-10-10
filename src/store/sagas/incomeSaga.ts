import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { Income, IncomeChannel } from '../../types';
import {
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
} from '../slices/incomeSlice';
import { fetchSummaryRequest } from '../slices/summarySlice';
import {
  addToast,
  closeIncomeModal,
  closeDeleteModal,
} from '../slices/uiSlice';

function* handleFetchIncome(
  action: PayloadAction<{ channel?: string; startDate?: string; endDate?: string } | undefined>
): Generator<any, void, any> {
  try {
    const data: Income[] = yield call(api.getIncome, action.payload);
    yield put(fetchIncomeSuccess(data));
  } catch (error: any) {
    yield put(fetchIncomeFailure(error.message || 'Failed to fetch income'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to load income' }));
  }
}

function* handleCreateIncome(
  action: PayloadAction<{
    amount: number;
    channel: IncomeChannel;
    description?: string | null;
    date: string;
  }>
): Generator<any, void, any> {
  try {
    const newIncome: Income = yield call(api.createIncome, action.payload);
    yield put(createIncomeSuccess(newIncome));
    yield put(closeIncomeModal());
    yield put(addToast({ type: 'success', message: 'Income logged successfully' }));

    // Synchronize summary
    const state: any = yield select();
    yield put(
      fetchSummaryRequest({
        startDate: state.ui.filter.startDate,
        endDate: state.ui.filter.endDate,
      })
    );
  } catch (error: any) {
    yield put(createIncomeFailure(error.message || 'Failed to create income entry'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to create income entry' }));
  }
}

function* handleUpdateIncome(
  action: PayloadAction<{
    id: string;
    data: {
      amount: number;
      channel: IncomeChannel;
      description?: string | null;
      date: string;
    };
  }>
): Generator<any, void, any> {
  try {
    const updated: Income = yield call(
      api.updateIncome,
      action.payload.id,
      action.payload.data
    );
    yield put(updateIncomeSuccess(updated));
    yield put(closeIncomeModal());
    yield put(addToast({ type: 'success', message: 'Income updated successfully' }));

    const state: any = yield select();
    yield put(
      fetchSummaryRequest({
        startDate: state.ui.filter.startDate,
        endDate: state.ui.filter.endDate,
      })
    );
  } catch (error: any) {
    yield put(updateIncomeFailure(error.message || 'Failed to update income entry'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to update income entry' }));
  }
}

function* handleDeleteIncome(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    yield call(api.deleteIncome, action.payload);
    yield put(deleteIncomeSuccess(action.payload));
    yield put(closeDeleteModal());
    yield put(addToast({ type: 'info', message: 'Income record deleted' }));

    const state: any = yield select();
    yield put(
      fetchSummaryRequest({
        startDate: state.ui.filter.startDate,
        endDate: state.ui.filter.endDate,
      })
    );
  } catch (error: any) {
    yield put(deleteIncomeFailure(error.message || 'Failed to delete income'));
    yield put(addToast({ type: 'error', message: error.message || 'Failed to delete income' }));
  }
}

export function* incomeSaga() {
  yield takeLatest(fetchIncomeRequest.type, handleFetchIncome);
  yield takeLatest(createIncomeRequest.type, handleCreateIncome);
  yield takeLatest(updateIncomeRequest.type, handleUpdateIncome);
  yield takeLatest(deleteIncomeRequest.type, handleDeleteIncome);
}
