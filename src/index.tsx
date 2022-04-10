import * as React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './dataLayer/store';

import { App } from './components/app';

console.log('index.tsx');

const container = document.getElementById('root');
const reactRoot = createRoot(container);
reactRoot.render(
  <Provider store={store}>
    <App />
  </Provider>
);
