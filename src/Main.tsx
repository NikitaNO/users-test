import * as React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Users from './components/Users';
const users = require('./api/usersMock');

const Main = () => (
  <Provider store={store}>
    <Users users={users} />
  </Provider>
);

export default Main;
