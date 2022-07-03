import * as React from 'react';
import { Auth } from '../dataLayer/auth';
import {
  backupDataToStorage,
  loadData as loadDataFromStorage,
  saveData as saveDataToStorage
} from '../storage/storage';
import { useObservable } from '../dataLayer/observable/useObservable';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { DataLoadingState as DataOperation, Main } from './main';

export interface ISessionProps {
  auth: Auth;
}

type DataOperationQueueItem = 'load' | 'save';

export function Session(props: ISessionProps) {
  const dataLayer = useDataLayerContext();
  const [dataOperationQueue] = React.useState<DataOperationQueueItem[]>(['load']);

  const [currentDataOperation, setCurrentDataOperation] = React.useState<DataOperation>('none');

  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isDataLayerDirty = useObservable(dataLayer.isDirty);

  async function loadData(): Promise<void> {
    if (currentDataOperation !== 'none') {
      console.warn('Tried to start a load operation while another operation was ongoing - ignored');
      return;
    }
    try {
      console.log(`Loading`);
      setCurrentDataOperation('loading');
      const storedData = await loadDataFromStorage(await props.auth.getAccessToken());
      dataLayer.loadFromStorage(storedData);
      setCurrentDataOperation('none');
      processQueueIfIdle();
    } catch (error) {
      console.log('Load error: ' + error);
      setCurrentDataOperation('error');
    }
  }

  function processQueueIfIdle(): void {
    if (currentDataOperation === 'none') {
      const operation = dataOperationQueue.shift();
      switch (operation) {
        case 'load':
          loadData();
          break;
        case 'save':
          saveData();
          break;
        case undefined:
          break;
        default:
          console.warn(`Unexpected dataOperationQueue item encountered: ${operation}`);
          break;
      }
    }
  }

  function enqueueDataOperation(operation: DataOperationQueueItem): void {
    dataOperationQueue.push(operation);
    processQueueIfIdle();
  }

  // When the data layer says the data just got dirtied, start the save timer
  React.useEffect(() => {
    if (isDataLayerDirty) {
      saveInOneSecondIfNewChangesAreNotMade();
    }
  }, [isDataLayerDirty]);

  React.useEffect(() => {
    processQueueIfIdle();
    const loadTimer = setInterval(() => {
      console.log(`Enqueuing regularly scheduled load operation`);
      enqueueDataOperation('load');
    }, 60 * 1000);
    return () => {
      clearInterval(loadTimer);
    };
  }, []);

  async function saveData(): Promise<void> {
    if (currentDataOperation !== 'none') {
      console.warn('Tried to start a save operation while another operation was ongoing - ignored');
      return;
    }
    try {
      // Load first to make sure we don't stop any other changes made remotely
      console.log(`Loading before saving`);
      await loadData();

      // Now save after the load is complete (which also merged our local changes into memory)
      console.log(`Saving`);
      setCurrentDataOperation('saving');
      const dataToSave = dataLayer.getDataToSave();
      dataLayer.isDirty.value = false;
      await saveDataToStorage(await props.auth.getAccessToken(), dataToSave);
      await backupDataToStorage(await props.auth.getAccessToken(), dataToSave);
      setCurrentDataOperation('none');
    } catch (error) {
      console.error('Save error: ' + error);
      setCurrentDataOperation('error');
      saveInOneSecondIfNewChangesAreNotMade();
    }
  }

  function saveInOneSecondIfNewChangesAreNotMade() {
    if (saveTimer.current !== undefined) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(() => enqueueDataOperation('save'), 1000);
  }

  return <Main auth={props.auth} dataLoadingState={currentDataOperation}></Main>;
}
