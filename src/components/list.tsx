import * as React from 'react';
import { useSelector } from 'react-redux';
import { IV1Entry, selectEntries } from '../dataLayer/entriesSlice';
import { ListItem } from './listItem';

export function List() {
  const entries = useSelector(selectEntries);
  const contents = entries.map((entry: IV1Entry) => <ListItem key={entry.id} entry={entry}></ListItem>);

  return <div>{contents}</div>;
}
