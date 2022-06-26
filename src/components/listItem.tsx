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
  const tags = useObservable(props.entry.tags);

  return (
    <div className="listItem" onClick={props.clicked}>
      <div className="entryHeader">
        <div className="entryDate">{new Date(date).toDateString()}</div>
        <div className="tagList">
          {tags.map((tagItem) => (
            <span className="tag" style={{ borderColor: tagItem.color }} key={tagItem.name}>
              {tagItem.name}
            </span>
          ))}
        </div>
      </div>
      <div className="entryBody">{body}</div>
    </div>
  );
}
