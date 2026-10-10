import { all, fork } from 'redux-saga/effects';
import { expensesSaga } from './sagas/expensesSaga';
import { incomeSaga } from './sagas/incomeSaga';
import { summarySaga } from './sagas/summarySaga';

export function* rootSaga() {
  yield all([
    fork(expensesSaga),
    fork(incomeSaga),
    fork(summarySaga),
  ]);
}
