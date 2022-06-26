import * as React from 'react';
import { IV1Entry } from '../dataLayer/v1/schema';
import { ListItem } from './listItem';

export interface IListProps {
  entries: IV1Entry[];
  itemClicked: (index: number) => void;
}

export function List(props: IListProps) {
  const contents = props.entries.map((entry: IV1Entry, index: number) => (
    <ListItem
      key={entry.id}
      entry={entry}
      clicked={() => {
        props.itemClicked(index);
      }}
    ></ListItem>
  ));

  return <div className="listRoot">{contents}</div>;
}
