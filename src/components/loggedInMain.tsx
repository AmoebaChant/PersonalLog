import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Auth } from '../dataLayer/auth';
import { loadAllEntries } from '../dataLayer/entriesSlice';
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
  const dispatch = useDispatch();

  async function loadData(): Promise<void> {
    try {
      setDataLoadingState('loading');
      const data = await loadDataFromOneDrive(await props.auth.getAccessToken());
      dispatch(loadAllEntries(data.entries.entries));
      setDataLoadingState('saved');
    } catch (error) {
      console.log('Load error: ' + error);
      setDataLoadingState('error');
    }
  }

  React.useEffect(() => {
    if (dataLoadingState === 'start') {
      loadData();
    }
  }, [dataLoadingState]);

  async function saveNow(): Promise<void> {
    try {
      setDataLoadingState('saving');
      await saveDataToOneDrive(await props.auth.getAccessToken(), store.getState());
      setDataLoadingState('saved');
    } catch (error) {
      console.log('Save error: ' + error);
      setDataLoadingState('error');
    }
  }

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (saveTimer.current !== undefined) {
        clearTimeout(saveTimer.current);
      }
      setDataLoadingState('dirty');
      saveTimer.current = setTimeout(saveNow, 1000);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Menu dataLoadingState={dataLoadingState} />
      <List />
    </div>
  );
}
