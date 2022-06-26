import * as React from 'react';
import { useObservable } from '../dataLayer/observable/useObservable';
import { IV1Entry } from '../dataLayer/v1/schema';

export interface IListItemProps {
  entry: IV1Entry;
  clicked: () => void;
}

export function ListItem(props: IListItemProps) {
  const date = useObservable(props.entry.date);
  const body = useObservable(props.entry.body);

  return (
    <div className="listItem" onClick={props.clicked}>
      <div className="entryHeader">
        <div className="entryDate">{new Date(date).toDateString()}</div>
      </div>
      <div className="entryBody">{body}</div>
    </div>
  );
}
