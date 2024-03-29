import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';
import { Auth } from './dataLayer/auth';
import { dataLayer, DataLayerContext } from './dataLayer/dataLayerContext';
import { filter, FilterContext } from './components/filterContext';
import { Filter } from './components/filter';

import './index.css';

const container = document.getElementById('root');
const auth = new Auth();

ReactDOM.render(
  <DataLayerContext.Provider value={dataLayer}>
    <FilterContext.Provider value={filter}>
      <App auth={auth} />
    </FilterContext.Provider>
  </DataLayerContext.Provider>,
  container
);
