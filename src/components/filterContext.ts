import * as React from 'react';

export interface IFilter {
  sort: 'DateDesc';
}

export const FilterContext = React.createContext<IFilter>({ sort: 'DateDesc' });
export const useFilterContext = () => React.useContext(FilterContext);
