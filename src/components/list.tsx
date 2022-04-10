import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IEntry, selectEntries } from '../dataLayer/entriesSlice';

export function List() {
  const entries = useSelector(selectEntries);
  const dispatch = useDispatch();

  const contents = entries.map((entry: IEntry) => <div key={entry.id}>{entry.name}</div>);

  return <div>{contents}</div>;
}
