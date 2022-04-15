import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IV1Entry, removeEntry, selectEntries } from '../dataLayer/entriesSlice';

export interface IListItemProps {
  entry: IV1Entry;
}

export function ListItem(props: IListItemProps) {
  const entries = useSelector(selectEntries);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="entryDate">
        {new Date(props.entry.date).toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
      </div>
      <div className="entryBody">{props.entry.body}</div>
      <button onClick={() => dispatch(removeEntry(props.entry.id))}>Remove</button>
    </div>
  );
}
