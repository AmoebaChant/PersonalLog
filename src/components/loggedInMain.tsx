import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Auth } from '../dataLayer/auth';
import { loadAllEntries, selectIsDirty, setIsDirty } from '../dataLayer/entriesSlice';
import { loadDataFromOneDrive, saveDataToOneDrive } from '../storage/storage';
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
      const rootState = await loadDataFromOneDrive(await props.auth.getAccessToken());
      dispatch(loadAllEntries(rootState.entries));
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
      const stateToSave = store.getState();
      await saveDataToOneDrive(await props.auth.getAccessToken(), stateToSave);
      if (stateToSave.entries.changeNumber === store.getState().entries.changeNumber) {
        dispatch(setIsDirty(false));
        setDataLoadingState('saved');
      } else {
        // Data change while we were saving
        setDataLoadingState('dirty');
        enqueueSave();
      }
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
    <div className="loggedInRoot">
      <Menu dataLoadingState={dataLoadingState} />
      <List />
    </div>
  );
}
