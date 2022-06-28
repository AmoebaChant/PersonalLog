import * as React from 'react';
import { IObservable, Observable } from '../dataLayer/observable/observable';
import { Filter } from './filter';

export interface IFilter {
  sort: 'DateDesc';
  tagsRequired: IObservable<string[]>;
  addRequiredTag(tagName: string): void;
  removeRequiredTag(tagName: string): void;
}

export const FilterContext = React.createContext<IFilter | undefined>({
  sort: 'DateDesc',
  tagsRequired: new Observable<string[]>([]),
  removeRequiredTag: () => {},
  addRequiredTag: () => {}
});
export const useFilterContext = () => React.useContext(FilterContext);
