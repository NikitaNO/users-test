import {
  compose,
  createStore,
  applyMiddleware,
  combineReducers
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import users from './modules/users';
import rootSaga from './sagas';

const composeEnhancers = (
  process.env.NODE_ENV !== 'production' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
)
  || compose;

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({ users });

const store =
  createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

sagaMiddleware.run(rootSaga);

export default store;
