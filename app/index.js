import React from 'react';
import Router from './containers/router';
import { Provider } from 'react-redux';

import store from './redux/store';


const app = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

export default app;
