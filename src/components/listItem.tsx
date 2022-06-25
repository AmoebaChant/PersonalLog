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
    <div className="listItem">
      <div className="entryHeader">
        <div className="entryDate">{new Date(props.entry.date).toDateString()}</div>
        {/* <button onClick={() => dispatch(removeEntry(props.entry.id))}>-</button> */}
      </div>
      <div className="entryBody">{props.entry.body}</div>
    </div>
  );
}
