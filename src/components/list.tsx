import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { useObservable } from '../dataLayer/observable/useObservable';
import { IV1Entry } from '../dataLayer/v1/schema';
import { useFilterContext } from './filterContext';
import { ListItem } from './listItem';

export function List() {
  const dataLayer = useDataLayerContext();
  const filter = useFilterContext();
  const entries = useObservable(dataLayer.entries);
  const [filteredEntries, setFilteredEntries] = React.useState<IV1Entry[]>([]);

  React.useEffect(() => {
    const newFilteredEntries = [...entries];
    if (filter.sort === 'DateDesc') {
      newFilteredEntries.sort((a, b) => {
        return Date.parse(b.date) - Date.parse(a.date);
      });
    }
    setFilteredEntries(newFilteredEntries);
  }, [entries, filter]);

  const contents = filteredEntries.map((entry: IV1Entry) => <ListItem key={entry.id} entry={entry}></ListItem>);

  return <div className="listRoot">{contents}</div>;
}
