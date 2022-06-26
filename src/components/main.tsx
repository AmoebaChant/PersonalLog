import * as React from 'react';
import { Auth } from '../dataLayer/auth';
import { List } from './list';
import { Menu } from './menu';
import { useObservable } from '../dataLayer/observable/useObservable';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { useFilterContext } from './filterContext';
import { IV1Entry } from '../dataLayer/v1/schema';

export type DataLoadingState = 'start' | 'loading' | 'saved' | 'dirty' | 'saving' | 'error';

export interface IMainProps {
  auth: Auth;
  dataLoadingState: DataLoadingState;
}

export function Main(props: IMainProps) {
  const dataLayer = useDataLayerContext();
  const filter = useFilterContext();
  const entries = useObservable(dataLayer.entries);
  const [filteredEntries, setFilteredEntries] = React.useState<IV1Entry[]>([]);
  const [currentListIndex, setCurrentListIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    const newFilteredEntries = [...entries];
    if (filter.sort === 'DateDesc') {
      newFilteredEntries.sort((a, b) => {
        return Date.parse(b.date) - Date.parse(a.date);
      });
    }
    setFilteredEntries(newFilteredEntries);
  }, [entries, filter]);

  return (
    <div className="loggedInRoot">
      <Menu dataLoadingState={props.dataLoadingState} />
      <List entries={filteredEntries} setCurrentListIndex={(newIndex: number) => setCurrentListIndex(newIndex)} />
      {/* {isEditDialogShown ? <EditDialog></EditDialog> : <></>}
        {isAddDialogShown ? <AddDialog></AddDialog> : <></>} */}
    </div>
  );
}
