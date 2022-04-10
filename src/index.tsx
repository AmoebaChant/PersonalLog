import * as React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from './dataLayer/store';

import { App } from './app';

console.log('index.tsx');

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
