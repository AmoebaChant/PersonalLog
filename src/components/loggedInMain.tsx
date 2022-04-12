import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Auth } from '../dataLayer/auth';
import { loadAllEntries, selectIsDirty } from '../dataLayer/entriesSlice';
import { loadDataFromOneDrive, saveDataToOneDrive } from '../dataLayer/oneDrive';
import { store } from '../dataLayer/store';
import { List } from './list';
import { Menu } from './menu';

export type DataLoadingState = 'start' | 'loading' | 'saved' | 'dirty' | 'saving' | 'error';

export interface ILoggedInMainProps {
  auth: Auth;
}

export function LoggedInMain(props: ILoggedInMainProps) {
  const [dataLoadingState, setDataLoadingState] = React.useState<DataLoadingState>('start');
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isDirty = useSelector(selectIsDirty);

  const dispatch = useDispatch();

  async function loadData(): Promise<void> {
    try {
      setDataLoadingState('loading');
      const entries = await loadDataFromOneDrive(await props.auth.getAccessToken());
      dispatch(loadAllEntries(entries));
      setDataLoadingState('saved');
    } catch (error) {
      console.log('Load error: ' + error);
      setDataLoadingState('error');
    }
  }

  React.useEffect(() => {
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
    if (isDirty) {
      setDataLoadingState('dirty');
    }
  }, [isDirty]);

  async function saveNow(): Promise<void> {
    try {
      setDataLoadingState('saving');
      await saveDataToOneDrive(await props.auth.getAccessToken(), store.getState().entries);
      setDataLoadingState('saved');
    } catch (error) {
      console.log('Save error: ' + error);
      setDataLoadingState('error');
    }
  }

  function enqueueSave() {
    if (saveTimer.current !== undefined) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(saveNow, 1000);
  }

  return (
    <div>
      <Menu dataLoadingState={dataLoadingState} />
      <List />
    </div>
  );
}
