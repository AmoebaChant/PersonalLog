import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEntry, IEntry, removeEntry, selectEntries } from './dataLayer/entriesSlice';

console.log('app.tsx');
//import styles from './Counter.module.css'

export function App() {
  const entries = useSelector(selectEntries);
  const dispatch = useDispatch();

  const contents = entries.map((entry: IEntry) => <div>{entry.name}</div>);

  return <div>{contents}</div>;
}
