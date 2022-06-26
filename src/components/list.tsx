import * as React from 'react';
import { IV1Entry } from '../dataLayer/v1/schema';
import { ListItem } from './listItem';

export interface IListProps {
  entries: IV1Entry[];
  setCurrentListIndex: (newIndex: number) => void;
}
export function List(props: IListProps) {
  const contents = props.entries.map((entry: IV1Entry) => <ListItem key={entry.id} entry={entry}></ListItem>);

  return <div className="listRoot">{contents}</div>;
}
