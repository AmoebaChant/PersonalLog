import * as React from 'react';
import { Auth } from '../dataLayer/auth';
import { loadData as loadDataFromStorage, saveData } from '../storage/storage';
import { List } from './list';
import { Menu } from './menu';
import { AddDialog } from './addDialog';
import { useObservable } from '../dataLayer/observable/useObservable';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';

export type DataLoadingState = 'start' | 'loading' | 'saved' | 'dirty' | 'saving' | 'error';

export interface ILoggedInMainProps {
  auth: Auth;
}

export function LoggedInMain(props: ILoggedInMainProps) {
  const dataLayer = useDataLayerContext();
  const [dataLoadingState, setDataLoadingState] = React.useState<DataLoadingState>('start');
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isAddDialogShown, setIsAddDialogShown] = React.useState<boolean>(false);
  const isDataLayerDirty = useObservable(dataLayer.isDirty);

  async function loadData(): Promise<void> {
    try {
      setDataLoadingState('loading');
      const storedData = await loadDataFromStorage(await props.auth.getAccessToken());
      dataLayer.loadFromStorage(storedData);
      setDataLoadingState('saved');
    } catch (error) {
      console.log('Load error: ' + error);
      setDataLoadingState('error');
    }
  }

  React.useEffect(() => {
    console.log(`New DataLoadingState: ${dataLoadingState}`);
    switch (dataLoadingState) {
      case 'start':
        loadData();
        break;
      case 'dirty':
        enqueueSave();
        break;
    }
  }, [dataLoadingState]);

  React.useEffect(() => {
    if (isDataLayerDirty) {
      setDataLoadingState((prevState) => (prevState !== 'saving' ? 'dirty' : 'saving'));
    }
  }, [isDataLayerDirty]);

  async function saveNow(): Promise<void> {
    try {
      setDataLoadingState('saving');
      const dataToSave = dataLayer.getDataToSave();
      dataLayer.isDirty.value = false;
      await saveData(await props.auth.getAccessToken(), dataToSave);
      if (dataLayer.isDirty.value) {
        // Another change happened while we were saving
        setDataLoadingState('dirty');
        enqueueSave();
      } else {
        setDataLoadingState('saved');
      }
    } catch (error) {
      console.log('Save error: ' + error);
      setDataLoadingState('error');
      enqueueSave();
    }
  }

  function enqueueSave() {
    if (saveTimer.current !== undefined) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(saveNow, 1000);
  }

  return (
    <div className="loggedInRoot">
      <Menu dataLoadingState={dataLoadingState} />
      <List />
      {isAddDialogShown ? <AddDialog></AddDialog> : <></>}
    </div>
  );
}
