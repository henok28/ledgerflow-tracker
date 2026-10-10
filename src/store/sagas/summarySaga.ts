import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { SummaryData } from '../../types';
import {
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
} from '../slices/summarySlice';

function* handleFetchSummary(
  action: PayloadAction<{ startDate?: string; endDate?: string } | undefined>
): Generator<any, void, any> {
  try {
    const data: SummaryData = yield call(api.getSummary, action.payload);
    yield put(fetchSummarySuccess(data));
  } catch (error: any) {
    yield put(fetchSummaryFailure(error.message || 'Failed to fetch summary'));
  }
}

export function* summarySaga() {
  yield takeLatest(fetchSummaryRequest.type, handleFetchSummary);
}
