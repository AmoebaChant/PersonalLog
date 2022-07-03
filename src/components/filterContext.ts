import * as React from 'react';
import { IObservable, Observable } from '../dataLayer/observable/observable';
import { Filter } from './filter';

export interface IFilter {
  sort: 'DateDesc';
  tagsRequired: IObservable<string[]>;
  addRequiredTag(tagName: string): void;
  removeRequiredTag(tagName: string): void;
}

export const filter = new Filter();
export const FilterContext = React.createContext<IFilter | undefined>(filter);
export const useFilterContext = () => React.useContext(FilterContext);
