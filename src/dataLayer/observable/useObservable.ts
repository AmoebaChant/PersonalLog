import { useState, useEffect } from 'react';
import { IObservable } from './observable';

export function useObservable<T>(observable: IObservable<T>) {
  const [value, setValue] = useState<T>(observable.value);
  useEffect(() => {
    function handleNewValue(newValue: T) {
      setValue(newValue);
    }
    const unsubscribe = observable.subscribe(handleNewValue, { notifyWithCurrentValue: false });
    return unsubscribe;
  }, [observable]);

  return value;
}
