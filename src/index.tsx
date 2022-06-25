import * as React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './dataLayer/store';

import { App } from './components/app';
import { Auth } from './dataLayer/auth';

import './index.css';

const container = document.getElementById('root');
const reactRoot = createRoot(container);
const auth = new Auth();
reactRoot.render(
  <Provider store={store}>
    <App auth={auth} />
  </Provider>
);
