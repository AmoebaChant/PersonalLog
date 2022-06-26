import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { useObservable } from '../dataLayer/observable/useObservable';
import { IV1Entry } from '../dataLayer/v1/schema';
import { ListItem } from './listItem';

export function List() {
  const dataLayer = useDataLayerContext();
  const entries = useObservable(dataLayer.entries);
  const contents = entries.map((entry: IV1Entry) => <ListItem key={entry.id} entry={entry}></ListItem>);

  return <div className="listRoot">{contents}</div>;
}
