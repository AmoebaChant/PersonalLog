import * as React from 'react';
import { IV1Entry } from '../dataLayer/v1/schema';

export interface IListItemProps {
  entry: IV1Entry;
}

export function ListItem(props: IListItemProps) {
  return (
    <div className="listItem">
      <div className="entryHeader">
        <div className="entryDate">{new Date(props.entry.date).toDateString()}</div>
      </div>
      <div className="entryBody">{props.entry.body}</div>
    </div>
  );
}
