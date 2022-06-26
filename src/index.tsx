import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/app';
import { Auth } from './dataLayer/auth';
import { dataLayer, DataLayerContext } from './dataLayer/dataLayerContext';

import './index.css';

const container = document.getElementById('root');
const reactRoot = createRoot(container);

const auth = new Auth();
reactRoot.render(
  <DataLayerContext.Provider value={dataLayer}>
    <App auth={auth} />
  </DataLayerContext.Provider>
);
