import * as React from 'react';
import { Auth } from '../dataLayer/auth';
import { List } from './list';
import { Menu } from './menu';
import { useObservable } from '../dataLayer/observable/useObservable';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { useFilterContext } from './filterContext';
import { IV1Entry } from '../dataLayer/v1/schema';
import { EditListItemDialog } from './editListItemDialog';
import { AddItemDialog } from './addDialog';

export type DataLoadingState = 'none' | 'loading' | 'saving' | 'error';

export interface IMainProps {
  auth: Auth;
  dataLoadingState: DataLoadingState;
}

export function Main(props: IMainProps) {
  const dataLayer = useDataLayerContext();
  const filter = useFilterContext();
  const filterTagsRequired = useObservable(filter.tagsRequired);
  const entries = useObservable(dataLayer.entries);
  const [filteredEntries, setFilteredEntries] = React.useState<IV1Entry[]>([]);
  const [addedEntry, setAddedEntry] = React.useState<IV1Entry>();
  const [currentListIndex, setCurrentListIndex] = React.useState<number>(-1);
  const [isEditDialogShown, setIsEditDialogShown] = React.useState<boolean>(false);
  const [isAddDialogShown, setIsAddDialogShown] = React.useState<boolean>(false);

  React.useEffect(() => {
    const newFilteredEntries = entries.filter((entry) => {
      if (filterTagsRequired.length === 0) {
        return true;
      }
      for (const requiredTag of filterTagsRequired) {
        if (entry.tags.value.findIndex((entryTag) => entryTag.name === requiredTag) === -1) {
          return false;
        }
      }
      return true;
    });
    if (filter.sort === 'DateDesc') {
      newFilteredEntries.sort((a, b) => {
        return Date.parse(b.date.value) - Date.parse(a.date.value);
      });
    }
    setFilteredEntries(newFilteredEntries);
  }, [entries, filter, filterTagsRequired]);

  function itemClicked(index: number) {
    setCurrentListIndex(index);
    setIsEditDialogShown(true);
  }

  function requestClose() {
    setIsEditDialogShown(false);
    setIsAddDialogShown(false);
  }

  function onAddItem() {
    const newEntry = dataLayer.createNewBlankEntry();
    setAddedEntry(newEntry);
    setIsAddDialogShown(true);
  }

  return (
    <div>
      <div className="loggedInRoot">
        <Menu dataLoadingState={props.dataLoadingState} addItem={onAddItem} />
        <List entries={filteredEntries} itemClicked={itemClicked} />
      </div>
      {isEditDialogShown ? (
        <EditListItemDialog
          entries={filteredEntries}
          initialIndex={currentListIndex}
          requestClose={requestClose}
        ></EditListItemDialog>
      ) : (
        <></>
      )}

      {isAddDialogShown ? <AddItemDialog entry={addedEntry} requestClose={requestClose}></AddItemDialog> : <></>}
    </div>
  );
}
