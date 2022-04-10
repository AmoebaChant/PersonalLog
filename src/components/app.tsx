import * as React from 'react';
import { store } from '../dataLayer/store';
import { List } from './list';
import { Menu } from './menu';
import throttle from 'lodash.throttle';
import { saveStateToLocalStorage } from '../dataLayer/persistentStorage';

export function App() {
  const [isSaved, setIsSaved] = React.useState<boolean>(true);
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function saveNow() {
    saveStateToLocalStorage(store.getState());
    setIsSaved(true);
  }

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (saveTimer.current !== undefined) {
        clearTimeout(saveTimer.current);
      }
      setIsSaved(false);
      saveTimer.current = setTimeout(() => {
        saveStateToLocalStorage(store.getState());
        setIsSaved(true);
      }, 1000);
    });
    return () => {
      unsubscribe();
    };
  }, [setIsSaved]);

  return (
    <div>
      <Menu isSaved={isSaved} />
      <List />
    </div>
  );
}
