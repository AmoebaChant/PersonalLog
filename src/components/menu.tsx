import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEntry, IEntry, removeEntry, selectEntries } from '../dataLayer/entriesSlice';
import { v4 as uuidv4 } from 'uuid';

export interface IMenuProps {
  isSaved: boolean;
}

export function Menu(props: IMenuProps) {
  const entries = useSelector(selectEntries);
  const dispatch = useDispatch();

  const contents = entries.map((entry: IEntry) => <div key={entry.id}>{entry.name}</div>);

  const savedState = props.isSaved ? <div>Saved</div> : <div>Saving...</div>;
  return (
    <div className="menuRoot">
      {savedState}
      <button onClick={() => dispatch(addEntry({ id: uuidv4(), name: Date.now().toString() }))}>Add</button>
    </div>
  );
}
