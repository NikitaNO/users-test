import { all } from 'redux-saga/effects'
import { watchUsers } from './users';

export default function* () {
  yield all([
    watchUsers()
  ]);
}
