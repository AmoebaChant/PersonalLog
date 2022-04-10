import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IEntry, removeEntry, selectEntries } from '../dataLayer/entriesSlice';

export interface IListItemProps {
  entry: IEntry;
}

export function ListItem(props: IListItemProps) {
  const entries = useSelector(selectEntries);
  const dispatch = useDispatch();

  return (
    <div>
      {props.entry.name}
      <button onClick={() => dispatch(removeEntry(props.entry.id))}>Remove</button>
    </div>
  );
}
