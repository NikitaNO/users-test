import { takeEvery, put, call } from 'redux-saga/effects';
import { getUsers } from '../../api';
import {
  GET_USERS_PENDING,
  GET_USERS_FULFILLED,
  GET_USERS_REJECTED
} from '../modules/users';

function* onGetUsers() {
  try {
    const payload = yield call(getUsers);

    yield put({
      type: GET_USERS_FULFILLED,
      payload
    });
  } catch (err) {
    yield put({
      type: GET_USERS_REJECTED
    });
  }
}

export function* watchUsers() {
  yield takeEvery(GET_USERS_PENDING, onGetUsers);
}
